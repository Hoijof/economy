import React from "react";
import {
  Typography,
  Grid,
  Slider,
  Input,
  // @ts-ignore
} from "@mui/material"; // @ts-ignore

import useTranslation from "../hooks/useTranslation";

export function ExpenseQuantitySelector({ value, onChange }) {
  const [t] = useTranslation();

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    onChange(newValue);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value === "" ? "" : Number(event.target.value));
  };

  return (
    <>
      <Grid item>
        <Typography variant="body1">{t["addExpenseType"]}</Typography>
      </Grid>
      <Grid item container spacing={2} alignItems="center">
        <Grid item xs>
          <Slider
            value={typeof value === "number" ? value : 0}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
          />
        </Grid>
        <Grid item>
          <Input
            value={value}
            onChange={handleInputChange}
            inputProps={{
              step: 1,
              min: 1,
              max: 100,
              type: "number",
              "aria-labelledby": "input-slider",
            }}
          />
        </Grid>
      </Grid>
    </>
  );
}
