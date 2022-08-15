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
} from "@mui/material"; // @ts-ignore

// @ts-ignore
import AddIcon from "@mui/icons-material/Add";

import useTranslation from "../hooks/useTranslation";

export function ExpenseTypeSelector({ type, onChange, options}) {
    const [t] = useTranslation();

    const handleClickType = useCallback(() => {
        console.log("handleClickType");
    }, []);

    const handleChangeType = useCallback(
        (event: React.ChangeEvent<{ value: string }>) => {
            onChange(event.target.value as string);
        },
        [onChange]
    );

    return (
        <>
            <Grid item container>
                <Grid item xs={10}>
                    <Typography variant="body1">
                        {t["addExpenseType"]}
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <IconButton aria-label="delete" onClick={handleClickType}>
                        <AddIcon />
                    </IconButton>
                </Grid>
            </Grid>
            <Grid item>
                <FormControl fullWidth>
                    <InputLabel id="add-expense-label">{t["addExpenseType"]}</InputLabel>
                    <Select
                        labelId="add-expense-label"
                        id="add-expense"
                        value={type}
                        label={t["addExpenseType"]}
                        onChange={handleChangeType}
                    >
                        {options.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
        </>
    );
}
