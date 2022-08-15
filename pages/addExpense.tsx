import React, { useState, useCallback } from "react";
// @ts-ignore
import Head from "next/head";
// @ts-ignore
import Link from "next/link";

import {
  Typography,
  Grid,
  Button,
  // @ts-ignore
} from "@mui/material";
// @ts-ignore
import HomeIcon from "@mui/icons-material/Home";

import useDb from "../hooks/useDb";
import useTranslation from "../hooks/useTranslation";

import { ExpenseTypeSelector } from "./../components/ExpenseTypeSelector";
import { ExpenseQuantitySelector } from "../components/ExpenseQuantitySelector";
import { createExpense } from "../utils/factories";
import { ExpenseDateSelector } from "../components/ExpenseDateSelector";
import { ExpenseTagSelector } from "../components/ExpenseTagSelector";

export default function AddExpense() {
  const db = useDb("economy");
  const [t] = useTranslation();

  const typeOptions = ["Standard", "Unexpected", "Other"];
  const tagOptions = ["Fast Food", "Groceries", "Transport", "Other"];

  const [type, setType] = useState("Standard");
  const [quantity, setQuantity] = useState(50);
  const [date, setDate] = useState(new Date());
  const [tags, setTags] = useState([]);

  const handleAddExpense = useCallback(() => {
    if (db) {
      db.add("expenses", createExpense(quantity, type, date, tags));
    }
  }, [db, quantity, type, date, tags]);

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
          <Grid container item>
            <Grid item xs={2}>
              <Link href="/">
                <HomeIcon sx={{ fontSize: 35 }} />
              </Link>
            </Grid>
            <Grid item xs>
              <Typography variant="h4">
                {t["addExpenseTitle"]}
              </Typography>
            </Grid>
          </Grid>
          <ExpenseTypeSelector
            type={type}
            onChange={setType}
            options={typeOptions}
          />
          <ExpenseQuantitySelector
            value={quantity}
            onChange={setQuantity}
          />
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddExpense}
            >
              {t["addExpenseCTA"]}
            </Button>
          </Grid>
          <ExpenseDateSelector value={date} onChange={setDate} />
          <ExpenseTagSelector
            tags={tags}
            onChange={setTags}
            options={tagOptions}
          />
        </Grid>
      </main>
    </div>
  );
}
