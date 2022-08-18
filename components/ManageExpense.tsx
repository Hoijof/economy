import React, { useState, useCallback } from "react";
// @ts-ignore
import Head from "next/head";
// @ts-ignore
import Link from "next/link";
// @ts-ignore
import { useRouter } from 'next/router';

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

import { ExpenseTypeSelector } from "./ExpenseTypeSelector";
import { ExpenseQuantitySelector } from "./ExpenseQuantitySelector";
import { createExpense } from "../utils/factories";
import { ExpenseDateSelector } from "./ExpenseDateSelector";
import { ExpenseTagSelector } from "./ExpenseTagSelector";

export default function ManageExpense({expenseId = null}) {
  const db = useDb("economy");
  const [t] = useTranslation();
  const router = useRouter();

  const [tagOptions, setTagOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);

  const [type, setType] = useState(1);
  const [quantity, setQuantity] = useState(50);
  const [date, setDate] = useState(new Date());
  const [tags, setTags] = useState([]);

  React.useEffect(() => {
    if (expenseId && db) {
      const expense = db.get("expenses", expenseId);

      if (!expense) {
        throw new Error(`Expense with id ${expenseId} not found`);
      }

      const {type, quantity, date, tags} = expense;
      setType(type);
      setQuantity(quantity);
      setDate(new Date(date));
      setTags(tags);
    }
  }, [db, expenseId]);

  // Get all tags from the database
  React.useEffect(() => {
    if (db) {
      let tags = db.get('expenseTags');

      if (tags.length === 0) {
        tags = createDefaultTags(db);
      }

      setTagOptions(tags);
    }
  } , [db]);

  // Get all types from the database
  React.useEffect(() => {
    if (db) {
      let types = db.get('expenseTypes');
      
      if (types.length === 0) {
        types = createDefaultTypes(db);
      }

      setTypeOptions(types);
    }
  } , [db]);

  // Handle create or edit of the expense
  const handleAddExpense = useCallback(() => {
    if (db) {
      if (expenseId) {
        db.update('expenses', expenseId, {
          type,
          quantity,
          date,
          tags
        });
      } else {
        db.add("expenses", createExpense(quantity, type, date, tags));
      }
      router.push('/')
    }
  }, [db, expenseId, router, type, quantity, date, tags]);

  const reloadTags = useCallback(() => {
    if (db) {
      setTagOptions(db.get('expenseTags'));
    }
  } , [db]);

  const reloadTypes = useCallback(() => {
    if (db) {
      setTypeOptions(db.get('expenseTypes'));
    }
  } , [db]);

  if (!db || tagOptions.length === 0 || typeOptions.length === 0) {
    return null;
  }

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
            <Grid item xs={2} sx={{
              position: "absolute"
            }}>
              <Link href="/">
                <HomeIcon sx={{ fontSize: 35, cursor: 'pointer' }} />
              </Link>
            </Grid>
            <Grid item xs={12} sx={{alignItems: 'center'}}>
              <Typography variant="h4" sx={{
                textAlign: "center"
              }}>
                {expenseId ? t["editExpenseCTA"] : t["addExpenseTitle"]}
              </Typography>
            </Grid>
          </Grid>
          <ExpenseTypeSelector
            type={type}
            onChange={setType}
            options={typeOptions}
            reloadTypes={reloadTypes}
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
              sx={{width: '100%'}}
            >
              {expenseId ? t['editExpenseCTA'] : t['addExpenseCTA']}
            </Button>
          </Grid>
          <ExpenseDateSelector value={date} onChange={setDate} />
          <ExpenseTagSelector
            tags={tags}
            onChange={setTags}
            options={tagOptions}
            reloadTags={reloadTags}
          />
        </Grid>
      </main>
    </div>
  );
}

function createDefaultTags(db) {
  db.add('expenseTags', {
    name: 'Standard',
    translation: 'expenseTagStandard'
  });
  db.add('expenseTags', {
    name: 'Unexpected',
    translation: 'expenseTagUnexpected'
  });
  db.add('expenseTags', {
    name: 'Recurrent',
    translation: 'expenseTagRecurrent'
  });

  return db.get('expenseTags');
}

function createDefaultTypes(db) {
  db.add('expenseTypes', {
    name: 'Fast Food',
    translation: 'expenseTypeFastFood'
  });
  db.add('expenseTypes', {
    name: 'Groceries',
    translation: 'expenseTypeGroceries'
  });
  db.add('expenseTypes', {
    name: 'Transport',
    translation: 'expenseTypeTransport'
  });
  db.add('expenseTypes', {
    name: 'Bill',
    translation: 'expenseTypeBill'
  });

  return db.get('expenseTypes');
}