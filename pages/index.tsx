import React from "react";
// @ts-ignore
import Head from "next/head";
// @ts-ignore
import Image from "next/image";

// @ts-ignore
import {
    Typography,
    Grid,
    IconButton,
    Card,
    CardContent,
    CardActions,
} from "@mui/material";
// @ts-ignore
import DeleteIcon from "@mui/icons-material/Delete";

import useDb from "../hooks/useDb";
import useTranslation from "../hooks/useTranslation";

export default function Home() {
    const db = useDb("economy");
    const [t] = useTranslation();

    const [expenses, setExpenses] = React.useState([]);

    React.useEffect(() => {
        if (db) {
            setExpenses(db.get("expenses") as Expense[]);
        }
    }, [db]);

    return (
        <div>
            <Head>
                <title>Summary</title>
                <meta name="description" content="General summary of Economy" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <Typography variant="h4">Summary</Typography>
                <Typography variant="body1">
                    This is the summary of the economy.
                </Typography>
                <Grid container direction="column">
                    {expenses.map(({ quantity, type, __id }) => (
                        <Card key={__id} sx={{ margin: 2 }}>
                            <CardContent>
                                <Grid container direction="row">
                                    <Grid item xs={4}>
                                        <Typography
                                            gutterBottom
                                            variant="h5"
                                            component="div"
                                        >
                                            {quantity}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} sx={{textAlign: 'right'}}>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {type}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={2}>
                                    <IconButton size="small">
                                    <DeleteIcon />
                                </IconButton>
                                </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    ))}
                </Grid>
            </main>
        </div>
    );
}
