SELECT
    p.TRANSACTION_DATE,
       	ROUND(SUM(
            CASE
                WHEN c.END_DATE IS NULL THEN
                    CASE
                        WHEN b.USER_ID IS NULL THEN
                            CASE
                                WHEN p.CURRENCY = 111 
                                THEN p.AMOUNT
                                ELSE p.AMOUNT * cr.EXCHANGE_RATE_TO_EUR
                            END
                        ELSE 0
                    END
                ELSE 0
            END
        ),2) AS AMOUNT_EUR
    FROM
        PAYMENTS AS p
    LEFT JOIN
        BLACKLIST AS b ON p.USER_ID_SENDER = b.USER_ID
    LEFT JOIN
        CURRENCIES AS c ON p.CURRENCY = c.CURRENCY_ID
    LEFT JOIN
        CURRENCY_RATES AS cr ON p.CURRENCY = cr.CURRENCY_ID AND p.TRANSACTION_DATE = cr.EXCHANGE_DATE
    WHERE
        c.END_DATE IS NULL
    GROUP BY
        p.TRANSACTION_DATE
	ORDER BY 
        p.TRANSACTION_DATE