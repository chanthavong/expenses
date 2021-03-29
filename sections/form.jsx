import tw, { styled } from 'twin.macro'
import { useMutation, useSubscription } from '@apollo/client'

import { Button } from '../components'
import { CATEGORIES, INSERT_TRANSACTION, PAYMENT_METHODS } from '../graphql'

const Styles = {
   Fieldset: styled.fieldset`
      ${tw`flex flex-col space-y-1 mt-2 flex-1`}
   `,
   Label: styled.label`
      ${tw`text-sm text-gray-500 uppercase font-medium tracking-wider`}
   `,
   Text: styled.input`
      ${tw`bg-gray-700 h-10 rounded px-2`}
   `,
   Select: styled.select`
      ${tw`bg-gray-700 h-10 rounded`}
   `,
}

export const Form = ({ close, transaction = {} }) => {
   const [form, setForm] = React.useState({
      title: '',
      amount: '',
      type: 'expense',
      date: '',
      category_id: '',
      payment_method_id: '',
   })
   const [upsert, { loading }] = useMutation(INSERT_TRANSACTION, {
      onCompleted: () => close(false),
      onError: error => {
         console.log('insert -> error -> ', error)
      },
   })
   const { data: { categories = [] } = {} } = useSubscription(CATEGORIES)
   const { data: { payment_methods = [] } = {} } = useSubscription(
      PAYMENT_METHODS
   )

   React.useEffect(() => {
      if (
         typeof transaction === 'object' &&
         Object.keys(transaction).length > 0
      ) {
         const { __typename, payment_method, category, ...rest } = transaction
         setForm(existing => ({ ...existing, ...rest }))
      }
   }, [transaction])

   const isFormValid =
      form.title &&
      form.amount > 0 &&
      form.type &&
      form.date &&
      form.category_id &&
      form.payment_method_id

   const handleSubmit = () => {
      if (!isFormValid) return

      upsert({
         variables: {
            object: {
               ...form,
               amount: Number(form.amount),
               date: new Date(form.date).toISOString(),
            },
            update_columns: [
               'date',
               'type',
               'title',
               'amount',
               'category_id',
               'payment_method_id',
            ],
         },
      })
   }

   const handleChange = (name, value) => {
      setForm(existing => ({ ...existing, [name]: value }))
   }
   return (
      <>
         <Styles.Fieldset>
            <Styles.Label htmlFor="title">Title</Styles.Label>
            <Styles.Text
               id="title"
               type="text"
               name="title"
               value={form.title}
               placeholder="Enter the title"
               onChange={e => handleChange(e.target.name, e.target.value)}
            />
         </Styles.Fieldset>
         <Styles.Fieldset>
            <Styles.Label htmlFor="amount">Amount</Styles.Label>
            <Styles.Text
               type="text"
               id="amount"
               name="amount"
               value={form.amount}
               placeholder="Enter the amount"
               onChange={e => handleChange(e.target.name, e.target.value)}
            />
         </Styles.Fieldset>
         <Styles.Fieldset>
            <Styles.Label htmlFor="date">Date</Styles.Label>
            <Styles.Text
               type="date"
               id="date"
               name="date"
               value={form.date}
               placeholder="Select the date"
               onChange={e => handleChange(e.target.name, e.target.value)}
            />
         </Styles.Fieldset>
         <section tw="flex items-center gap-2">
            <Styles.Fieldset>
               <Styles.Label htmlFor="type">Type</Styles.Label>
               <section tw="bg-gray-700 px-1 h-10 flex items-center rounded">
                  <button
                     css={[
                        tw`px-2 h-8 flex-1 rounded`,
                        form.type === 'expense' && tw`bg-gray-800`,
                     ]}
                     onClick={() => handleChange('type', 'expense')}
                  >
                     Expense
                  </button>
                  <button
                     css={[
                        tw`px-2 h-8 flex-1 rounded`,
                        form.type === 'income' && tw`bg-gray-800`,
                     ]}
                     onClick={() => handleChange('type', 'income')}
                  >
                     Income
                  </button>
               </section>
            </Styles.Fieldset>
            <Styles.Fieldset>
               <Styles.Label htmlFor="category">Category</Styles.Label>
               <Styles.Select
                  name="category_id"
                  id="category_id"
                  value={form.category_id}
                  onChange={e => handleChange(e.target.name, e.target.value)}
               >
                  {categories
                     .filter(node => node.type === form.type)
                     .map(category => (
                        <option key={category.id} value={category.id}>
                           {category.title}
                        </option>
                     ))}
               </Styles.Select>
            </Styles.Fieldset>
         </section>
         <Styles.Fieldset>
            <Styles.Label htmlFor="payment_method">Payment Method</Styles.Label>
            <Styles.Select
               name="payment_method_id"
               id="payment_method_id"
               value={form.payment_method_id}
               onChange={e => handleChange(e.target.name, e.target.value)}
            >
               {payment_methods.map(payment_method => (
                  <option key={payment_method.id} value={payment_method.id}>
                     {payment_method.title}
                  </option>
               ))}
            </Styles.Select>
         </Styles.Fieldset>
         <div tw="h-4" />
         <Button.Text
            is_loading={loading}
            onClick={handleSubmit}
            is_disabled={!isFormValid}
         >
            Submit
         </Button.Text>
      </>
   )
}
