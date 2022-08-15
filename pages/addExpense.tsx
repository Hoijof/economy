import React, { useState, useCallback } from "react";
// @ts-ignore
import Head from "next/head";
// @ts-ignore
import Image from "next/image";

import {
    Typography,
    Grid,
    Button,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
// @ts-ignore
} from "@mui/material";

// @ts-ignore
import AddIcon from "@mui/icons-material/Add";

import useDb from "../hooks/useDb";
import useTranslation from "../hooks/useTranslation";

import { ExpenseTypeSelector } from './../components/ExpenseTypeSelector';
import { ExpenseQuantitySelector } from "../components/ExpenseQuantitySelector";
import { createExpense } from "../utils/factories";

export default function AddExpense() {
    const db = useDb("economy");
    const [t] = useTranslation();

    const typeOptions = ['Standard', 'Unexpected', 'Other'];

    const [type, setType] = useState("Standard");
    const [quantity, setQuantity] = useState(50);

    const handleAddExpense = useCallback(() => {
        if (db) {
            db.get('economy');

            db.add('expenses', createExpense(quantity, type));
        }
    } , [db, quantity, type]);
    
    return (
        <div>
            <Head>
                <title>Summary</title>
                <meta name="description" content="General summary of Economy" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main
                style={{
                    padding: "1rem",
                }}
            >
                <Grid container spacing={3} direction="column">
                    <Grid item>
                        <Typography variant="h4">
                            {t["addExpenseTitle"]}
                        </Typography>
                    </Grid>
                    <ExpenseTypeSelector type={type} onChange={setType} options={typeOptions}/>
                    <ExpenseQuantitySelector value={quantity} onChange={setQuantity} />
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={handleAddExpense}>
                            {t["addExpenseCTA"]}
                        </Button>
                        </Grid>
                </Grid>
            </main>
        </div>
    );
}
