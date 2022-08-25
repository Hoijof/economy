import React, { useState, useCallback } from 'react';
// @ts-ignore
import Head from 'next/head';

// @ts-ignore
import { useRouter } from 'next/router';

import {
  Grid,
  Button,
  // @ts-ignore
} from '@mui/material';

import useDb from '../hooks/useDb';
import useTranslation from '../hooks/useTranslation';

import { ExpenseTypeSelector } from './ExpenseTypeSelector';
import { ExpenseQuantitySelector } from './ExpenseQuantitySelector';
import { createExpense } from '../utils/factories';
import { ExpenseDateSelector } from './ExpenseDateSelector';
import { ExpenseTagSelector } from './ExpenseTagSelector';
import {
  addExpense,
  getExpenseByHash,
  updateExpense,
} from '../services/expenseService';

export default function ManageExpense({ expenseHash = null }) {
  const db = useDb('economy');
  const [t] = useTranslation();
  const router = useRouter();

  const [tagOptions, setTagOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);

  const [type, setType] = useState(1);
  const [quantity, setQuantity] = useState(50);
  const [date, setDate] = useState(new Date());
  const [tags, setTags] = useState([]);

  React.useEffect(() => {
    if (expenseHash) {
      const expense = getExpenseByHash(expenseHash);

      if (!expense) {
        throw new Error(`Expense with hash ${expenseHash} not found`);
      }

      const { type, quantity, date, tags } = expense;
      setType(type);
      setQuantity(quantity);
      setDate(new Date(date));
      setTags(tags);
    }
  }, [db, expenseHash]);

  // Get all tags from the database
  React.useEffect(() => {
    if (db) {
      let tags = db.get('expenseTags');

      if (tags.length === 0) {
        tags = createDefaultTags(db);
      }

      setTagOptions(tags);
    }
  }, [db]);

  // Get all types from the database
  React.useEffect(() => {
    if (db) {
      let types = db.get('expenseTypes');

      if (types.length === 0) {
        types = createDefaultTypes(db);
      }

      setTypeOptions(types);
    }
  }, [db]);

  // Handle create or edit of the expense
  const handleAddExpense = useCallback(() => {
    if (expenseHash) {
      updateExpense(expenseHash, {
        type,
        quantity,
        date,
        tags,
      });
    } else {
      addExpense(createExpense(quantity, type, date, tags));
    }
    router.push('/');
  }, [expenseHash, router, type, quantity, date, tags]);

  const reloadTags = useCallback(() => {
    if (db) {
      setTagOptions(db.get('expenseTags'));
    }
  }, [db]);

  const reloadTypes = useCallback(() => {
    if (db) {
      setTypeOptions(db.get('expenseTypes'));
    }
  }, [db]);

  if (!db || tagOptions.length === 0 || typeOptions.length === 0) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{expenseHash ? t['editExpenseCTA'] : t['addExpenseCTA']}</title>
        <meta name="description" content="General summary of Economy" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ExpenseTypeSelector
        type={type}
        onChange={setType}
        options={typeOptions}
        reloadTypes={reloadTypes}
      />
      <ExpenseQuantitySelector value={quantity} onChange={setQuantity} />
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddExpense}
          sx={{ width: '100%' }}
        >
          {expenseHash ? t['editExpenseCTA'] : t['addExpenseCTA']}
        </Button>
      </Grid>
      <ExpenseDateSelector value={date} onChange={setDate} />
      <ExpenseTagSelector
        tags={tags}
        onChange={setTags}
        options={tagOptions}
        reloadTags={reloadTags}
      />
    </>
  );
}

function createDefaultTags(db) {
  db.add('expenseTags', {
    name: 'Standard',
    translation: 'expenseTagStandard',
  });
  db.add('expenseTags', {
    name: 'Unexpected',
    translation: 'expenseTagUnexpected',
  });
  db.add('expenseTags', {
    name: 'Recurrent',
    translation: 'expenseTagRecurrent',
  });

  return db.get('expenseTags');
}

function createDefaultTypes(db) {
  db.add('expenseTypes', {
    name: 'Fast Food',
    translation: 'expenseTypeFastFood',
  });
  db.add('expenseTypes', {
    name: 'Groceries',
    translation: 'expenseTypeGroceries',
  });
  db.add('expenseTypes', {
    name: 'Transport',
    translation: 'expenseTypeTransport',
  });
  db.add('expenseTypes', {
    name: 'Bill',
    translation: 'expenseTypeBill',
  });

  return db.get('expenseTypes');
}
