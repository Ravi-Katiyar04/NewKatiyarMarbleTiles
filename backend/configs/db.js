import mongoose from "mongoose";

// Helps avoid DNS/SRV oddities on Node 18+ (esp. Windows)
import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");


if (process.env.MONGODB_DNS_SERVERS) {
    const servers = process.env.MONGODB_DNS_SERVERS.split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    if (servers.length) dns.setServers(servers);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const connectDB = async () => {
    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is not set");
    }

    const uri = process.env.MONGODB_URI;
    const fallbackDbName = process.env.MONGODB_DBNAME || "QuickBasket";
    let attempt = 0;
    let delayMs = 1000;
    let didForcePublicDns = false;
    let didLogSrvDnsWarning = false;

    // Keep the process alive under nodemon; retry until Mongo comes up / DNS works.
    // This prevents "app crashed" loops for transient network/DNS problems.
    // eslint-disable-next-line no-constant-condition
    while (true) {
        attempt += 1;
        try {
            await mongoose.connect(uri, {
                // Ensures we use the intended database even if the URI path is missing.
                // If the URI already includes /<db>, Mongo will still honor that name.
                dbName: fallbackDbName,
                serverSelectionTimeoutMS: 5000,
                connectTimeoutMS: 10000,
            });
            const connectedDb =
                mongoose.connection?.db?.databaseName || mongoose.connection?.name;
            console.log(`MongoDB connected${connectedDb ? ` (${connectedDb})` : ""}`);
            return;
        } catch (error) {
            const message = error?.message || String(error);
            const isSrvDnsIssue =
                message.includes("querySrv") ||
                message.includes("ECONNREFUSED") ||
                message.includes("ENOTFOUND");

            if (
                isSrvDnsIssue &&
                !process.env.MONGODB_DNS_SERVERS &&
                !didForcePublicDns
            ) {
                didForcePublicDns = true;
                try {
                    dns.setServers(["1.1.1.1", "8.8.8.8"]);
                    console.warn(
                        "MongoDB SRV lookup failed; retrying with public DNS (1.1.1.1, 8.8.8.8)."
                    );
                } catch {
                    // ignore - we'll still retry with the default resolver
                }
                delayMs = 500;
            }

            // Don't scare logs on a transient SRV/DNS hiccup we can recover from.
            // First SRV/DNS error: warn once (no long tip). After that: error + tip.
            if (isSrvDnsIssue && !didLogSrvDnsWarning) {
                didLogSrvDnsWarning = true;
                console.warn(
                    `MongoDB SRV/DNS lookup failed (attempt ${attempt}). Retrying... (${message})`
                );
            } else {
                console.error(
                    `MongoDB connection error (attempt ${attempt}): ${message}${
                        isSrvDnsIssue
                            ? "\nTip: If you're using a 'mongodb+srv://' URI, this error is often DNS/SRV related. Try switching networks/VPN, allowing DNS (port 53), or use a standard 'mongodb://' connection string."
                            : ""
                    }`
                );
            }

            await sleep(delayMs);
            delayMs = Math.min(delayMs * 2, 30000);
        }
    }
};

export default connectDB;

// import mongoose from "mongoose";
// import dns from "node:dns";

// // This line is crucial for Node.js 18+ on Windows to prevent DNS resolution issues
// dns.setDefaultResultOrder('ipv4first');

// const connectDB = async () => {
//     try {
//         // We use the URI directly. Ensure /QuickBasket is included in the string or pass it here
//         await mongoose.connect(process.env.MONGODB_URI, {
//             serverSelectionTimeoutMS: 5000, // Fail faster so you don't wait 30s
//             connectTimeoutMS: 10000,
//         });
//         console.log("🚀 MongoDB connected to QuickBasket");
//     } catch (error) {
//         console.error("❌ MongoDB connection error:", error.message);
//         process.exit(1);
//     }
// };

// export default connectDB;