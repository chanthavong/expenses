import React from 'react'
import { useSubscription } from '@apollo/react-hooks'

import { formatCurrency } from '../utils'
import { Stat, Tab } from '../components'
import { TOTAL_EXPENSES, TOTAL_EARNINGS } from '../graphql'

export const Header = () => {
   const { data: expensesData, loading: expensesLoading } = useSubscription(
      TOTAL_EXPENSES
   )
   const { data: earningsData, loading: earningsLoading } = useSubscription(
      TOTAL_EARNINGS
   )
   return (
      <header>
         <section className="grid gap-3 sm:grid-cols-2 lg:flex lg:space-x-3 mb-6">
            <Stat type="expenses" label="Total Expenses">
               {!expensesLoading
                  ? formatCurrency(
                       expensesData?.total_expenses.aggregate.sum.amount
                    )
                  : formatCurrency(0)}
            </Stat>
            <Stat type="earnings" label="Total Earning">
               {!earningsLoading
                  ? formatCurrency(
                       earningsData?.total_earnings.aggregate.sum.amount
                    )
                  : formatCurrency(0)}
            </Stat>
            <Stat type="neutral" label="Balance">
               {!expensesLoading && !earningsLoading
                  ? formatCurrency(
                       earningsData?.total_earnings.aggregate.sum.amount -
                          expensesData?.total_expenses.aggregate.sum.amount
                    )
                  : formatCurrency(0)}
            </Stat>
         </section>
         <div className="rounded-lg border">
            <Tab href="/expenses">Expenses</Tab>
            <Tab href="/earnings">Earning</Tab>
            <Tab href="/analytics">Analytics</Tab>
         </div>
      </header>
   )
}
