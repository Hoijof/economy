import React from "react";
// @ts-ignore
import Head from "next/head";
// @ts-ignore
import Image from "next/image";

// @ts-ignore
import { Typography, Grid, Button } from "@mui/material";

import useDb from "../hooks/useDb";


export default function AddExpense() {
    const db = useDb('economy');
    
    return (
        <div>
            <Head>
                <title>Summary</title>
                <meta name="description" content="General summary of Economy" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <Typography variant="h4">Summary</Typography>
                <Typography variant="body1">This is the summary of the economy.</Typography>
                <Typography variant="body1"> Expenses Collection: {oMoney}</Typography>
            </main>
        </div>
    );
}