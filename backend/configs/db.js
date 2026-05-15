import "dotenv/config";
import mongoose from "mongoose";
import dns from "node:dns";
import { Resolver } from "node:dns/promises";

// Helps avoid DNS oddities on Node 18+ (especially Windows)
dns.setDefaultResultOrder("ipv4first");

const PUBLIC_DNS = ["1.1.1.1", "8.8.8.8"];

function getDnsServers() {
    const fromEnv = process.env.MONGODB_DNS_SERVERS?.split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    return fromEnv?.length ? fromEnv : PUBLIC_DNS;
}

dns.setServers(getDnsServers());

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function parseMongoSrvUri(uri) {
    if (!uri.startsWith("mongodb+srv://")) return null;

    const rest = uri.slice("mongodb+srv://".length);
    const atIdx = rest.lastIndexOf("@");
    let auth = "";
    let hostAndRest = rest;

    if (atIdx !== -1) {
        auth = rest.slice(0, atIdx + 1);
        hostAndRest = rest.slice(atIdx + 1);
    }

    const qIdx = hostAndRest.indexOf("?");
    const slashIdx = hostAndRest.indexOf("/");

    let host;
    let path = "";
    let query = "";

    if (slashIdx === -1) {
        host = qIdx === -1 ? hostAndRest : hostAndRest.slice(0, qIdx);
        query = qIdx === -1 ? "" : hostAndRest.slice(qIdx);
    } else {
        host = hostAndRest.slice(0, slashIdx);
        const afterSlash = hostAndRest.slice(slashIdx);
        if (qIdx === -1) {
            path = afterSlash;
        } else {
            path = afterSlash.slice(0, afterSlash.indexOf("?"));
            query = afterSlash.slice(afterSlash.indexOf("?"));
        }
    }

    return { auth, host, path, query };
}

function mergeQueryParams(existingQuery, txtRecord) {
    const params = new URLSearchParams(
        existingQuery.startsWith("?") ? existingQuery.slice(1) : existingQuery
    );

    if (txtRecord) {
        for (const part of txtRecord.split("&")) {
            const [key, ...valueParts] = part.split("=");
            if (!key || params.has(key)) continue;
            params.set(key, valueParts.join("="));
        }
    }

    if (!params.has("ssl")) params.set("ssl", "true");
    if (!params.has("authSource")) params.set("authSource", "admin");

    const serialized = params.toString();
    return serialized ? `?${serialized}` : "";
}

async function withTimeout(promise, ms, label) {
    let timer;
    const timeout = new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error(`${label} timeout after ${ms}ms`)), ms);
    });
    try {
        return await Promise.race([promise, timeout]);
    } finally {
        clearTimeout(timer);
    }
}

async function resolveSrvMongoUri(srvUri) {
    if (process.env.MONGODB_URI_STANDARD?.startsWith("mongodb://")) {
        return process.env.MONGODB_URI_STANDARD;
    }

    const parsed = parseMongoSrvUri(srvUri);
    if (!parsed) return srvUri;

    const resolver = new Resolver();
    resolver.setServers(getDnsServers());

    const srvName = `_mongodb._tcp.${parsed.host}`;
    const srvRecords = await withTimeout(
        resolver.resolveSrv(srvName),
        20000,
        "SRV"
    );

    let txtRecord = "";
    try {
        const txtRecords = await withTimeout(
            resolver.resolveTxt(parsed.host),
            15000,
            "TXT"
        );
        txtRecord = txtRecords.flat().join("");
    } catch {
        // TXT is helpful but not always required once hosts are known
    }

    const hosts = srvRecords
        .map((record) => `${record.name.replace(/\.$/, "")}:${record.port}`)
        .join(",");

    const query = mergeQueryParams(parsed.query, txtRecord);
    return `mongodb://${parsed.auth}${hosts}${parsed.path}${query}`;
}

let cachedResolvedUri = null;

async function getConnectUri() {
    const configuredUri = process.env.MONGODB_URI;
    if (!configuredUri) {
        throw new Error("MONGODB_URI is not set");
    }

    if (process.env.MONGODB_URI_STANDARD?.startsWith("mongodb://")) {
        return process.env.MONGODB_URI_STANDARD;
    }

    if (!configuredUri.startsWith("mongodb+srv://")) {
        return configuredUri;
    }

    if (cachedResolvedUri) return cachedResolvedUri;

    cachedResolvedUri = await resolveSrvMongoUri(configuredUri);
    return cachedResolvedUri;
}

const connectDB = async () => {
    const fallbackDbName = process.env.MONGODB_DBNAME || "QuickBasket";
    let attempt = 0;
    let delayMs = 1000;

    // eslint-disable-next-line no-constant-condition
    while (true) {
        attempt += 1;
        try {
            const uri = await getConnectUri();
            await mongoose.connect(uri, {
                dbName: fallbackDbName,
                serverSelectionTimeoutMS: 15000,
                connectTimeoutMS: 20000,
                family: 4,
            });

            const connectedDb =
                mongoose.connection?.db?.databaseName || mongoose.connection?.name;
            console.log(`MongoDB connected${connectedDb ? ` (${connectedDb})` : ""}`);
            return;
        } catch (error) {
            const message = error?.message || String(error);
            const isDnsIssue =
                message.includes("querySrv") ||
                message.includes("queryTxt") ||
                message.includes("ECONNREFUSED") ||
                message.includes("ENOTFOUND") ||
                message.includes("ETIMEOUT") ||
                message.includes("SRV") ||
                message.includes("TXT");

            if (isDnsIssue) {
                cachedResolvedUri = null;
            }

            const ipWhitelistHint = message.includes("whitelist")
                ? "\nTip: In MongoDB Atlas → Network Access, add your current IP (or 0.0.0.0/0 for local dev)."
                : "";

            const dnsHint = isDnsIssue
                ? "\nTip: DNS/SRV lookups are failing. Set MONGODB_DNS_SERVERS=1.1.1.1,8.8.8.8 in .env, or paste Atlas's standard connection string as MONGODB_URI_STANDARD."
                : "";

            console.error(
                `MongoDB connection error (attempt ${attempt}): ${message}${ipWhitelistHint}${dnsHint}`
            );

            await sleep(delayMs);
            delayMs = Math.min(delayMs * 2, 30000);
        }
    }
};

export default connectDB;
