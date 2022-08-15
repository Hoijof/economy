import React from "react";
import Head from "next/head";
import Image from "next/image";

import { Typography, Grid, Button } from "@mui/material";

import createDb from "../utils/db";

export default function Home() {
    const [oMoney, setOMoney]: [any, any] = React.useState({});
    const [money, setMoney] = React.useState(0);
    const [db, setDb] = React.useState(null);

    React.useEffect(() => {
        if (!db) {
            setDb(createDb("money"));

            return;
        }

        let dMoney = db.getC("money", 1);

        if (!dMoney) {
            dMoney = db.add("money", { cash: 0 });
        }

        setOMoney(dMoney);
        setMoney(dMoney.cash);
    }, [db]);

    const addMoney = React.useCallback(() => {
        oMoney.cash = oMoney.cash + 1;

        db.update("money", oMoney.id, { cash: oMoney.cash });

        setMoney(oMoney.cash);
    }, [db, oMoney]);

    const removeMoney = React.useCallback(() => {
        oMoney.cash = oMoney.cash - 1;

        db.update("money", oMoney.id, { cash: oMoney.cash });

        setMoney(oMoney.cash);
    }, [db, oMoney]);

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
                <Typography variant="body1"> Your money: {money}</Typography>

                <Button onClick={addMoney}>Add Money</Button>
                <Button onClick={removeMoney}>Remove Money</Button>
            </main>
        </div>
    );
}
