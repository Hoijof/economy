import React from 'react';
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import createDb from '../utils/db';

export default function Home() {
  const [oMoney, setOMoney]:  [any, any] = React.useState({});
  const [money, setMoney] = React.useState(0);
  const [db, setDb] = React.useState(null);

  React.useEffect(() => {
    if (!db) {
      setDb(createDb('money'));

      return;
    }

    let dMoney = db.getC('money', 1);

    if (!dMoney) {
      dMoney = db.add('money', { cash: 0 });
    }

    setOMoney(dMoney);
    setMoney(dMoney.cash);

  } ,[db]);

  const addMoney = React.useCallback(() => {
    oMoney.cash = oMoney.cash + 1;

    db.update('money', oMoney.id, { cash: oMoney.cash});

    setMoney(oMoney.cash);
  } , [db, oMoney]);

  const removeMoney = React.useCallback(() => {
    oMoney.cash = oMoney.cash - 1;

    db.update('money', oMoney.id, { cash: oMoney.cash});

    setMoney(oMoney.cash);
  } , [db, oMoney]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Summary</title>
        <meta name="description" content="General summary of Economy" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Summary
        </h1>
        <p className={styles.description}>
          This is the summary of the economy.
        </p>
        <p> Your money: {money}</p>

        <button onClick={addMoney}>Add Money</button>
        <button onClick={removeMoney}>Remove Money</button>
      </main>
    </div>
  );
  
}
