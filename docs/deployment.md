# Deployment Guide

## Prerequisites

1. Node.js 18+
2. MongoDB 5+
3. Core blockchain wallet with testnet CORE tokens
4. Core RPC endpoint access

## Environment Setup

### Backend Environment
1. Copy `.env.example` to `.env`
2. Configure MongoDB connection
3. Set JWT secret (minimum 32 characters)
4. Configure Core blockchain RPC URLs

### Contracts Environment
1. Copy `.env.example` to `.env`
2. Set deployment private key (DO NOT commit)
3. Configure block explorer API key for verification

## Deployment Steps

### 1. Database Setup
```bash
cd backend
npm install
npm run seed