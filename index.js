require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");

// Load konfigurasi dari .env
const RPC_URL = process.env.RPC_URL;
const provider = new ethers.JsonRpcProvider(RPC_URL);
const AMOUNT_TO_SEND = process.env.AMOUNT;
const NUM_TX = parseInt(process.env.NUM_TX || "5");
const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS;

// Load private keys dan buat wallet
const PRIVATE_KEYS = process.env.PRIVATE_KEYS.split(",");
const wallets = PRIVATE_KEYS.map((pk) => new ethers.Wallet(pk, provider));

// Load daftar alamat dari file
const addresses = fs.readFileSync("addresses.txt", "utf-8").trim().split("\n");

// Validasi alamat
const validAddresses = addresses.filter((addr) => ethers.isAddress(addr));

if (validAddresses.length === 0) {
    console.error("⚠️ Tidak ada alamat valid di addresses.txt!");
    process.exit(1);
}

// ABI standar ERC-20 untuk transfer token
const ERC20_ABI = [
    "function transfer(address to, uint256 amount) public returns (bool)",
    "function balanceOf(address account) external view returns (uint256)",
    "function decimals() external view returns (uint8)"
];

// Fungsi untuk mengirim token TEA
async function sendToken(wallet) {
    console.log(`🔹 Menggunakan wallet: ${wallet.address}`);

    const tokenContract = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, wallet);

    // Ambil desimal token
    const decimals = await tokenContract.decimals();
    const amount = ethers.parseUnits(AMOUNT_TO_SEND, decimals);

    // Periksa saldo wallet
    const balance = await tokenContract.balanceOf(wallet.address);
    if (balance < amount) {
        console.log(`❌ Saldo tidak cukup di ${wallet.address}, hanya memiliki ${ethers.formatUnits(balance, decimals)} TEA`);
        return;
    }

    for (let i = 0; i < NUM_TX; i++) {
        const recipient = validAddresses[Math.floor(Math.random() * validAddresses.length)];
        try {
            const tx = await tokenContract.transfer(recipient, amount);
            console.log(`[${i + 1}/${NUM_TX}] ✅ Mengirim ${AMOUNT_TO_SEND} TEA ke ${recipient}, TX: ${tx.hash}`);
            await tx.wait();
        } catch (error) {
            console.error(`❌ Gagal mengirim ke ${recipient}:`, error.message);
        }
    }
}

// Jalankan bot
async function main() {
    console.log(`📌 Total alamat valid: ${validAddresses.length}`);
    console.log(`📌 Total transaksi per wallet: ${NUM_TX}`);

    for (const wallet of wallets) {
        await sendToken(wallet);
    }
}

main().catch(console.error);
