import React, { useMemo, useState } from 'react'
import { Calculator } from 'lucide-react'
import { motion } from 'framer-motion'

const format = (value) => `Rs ${Math.round(value).toLocaleString('en-IN')}`

export default function EMICalculator() {
  const [loan, setLoan] = useState(7500000)
  const [rate, setRate] = useState(8.5)
  const [tenure, setTenure] = useState(20)

  const result = useMemo(() => {
    const monthlyRate = rate / 12 / 100
    const months = tenure * 12
    const emi = loan * monthlyRate * ((1 + monthlyRate) ** months) / (((1 + monthlyRate) ** months) - 1)
    const totalAmount = emi * months
    const totalInterest = totalAmount - loan
    return { emi, totalInterest, totalAmount }
  }, [loan, rate, tenure])

  return (
    <section id="services" className="bg-white py-20">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[.88fr_1.12fr] lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="section-eyebrow">Smart planning</p>
          <h2 className="section-title mt-2 text-4xl md:text-5xl">EMI Calculator</h2>
          <p className="mt-4 text-[#6B7280]">Estimate monthly payments before shortlisting properties. Tune loan amount, interest rate, and tenure instantly.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="surface rounded-3xl p-5 md:p-7"
        >
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
            <label className="text-sm font-bold text-[#1F2937]">
              Loan Amount
              <input className="input-field mt-2" type="number" value={loan} onChange={(event) => setLoan(Number(event.target.value))} />
            </label>
            <label className="text-sm font-bold text-[#1F2937]">
              Interest Rate
              <input className="input-field mt-2" type="number" step="0.1" value={rate} onChange={(event) => setRate(Number(event.target.value))} />
            </label>
            <label className="text-sm font-bold text-[#1F2937] sm:col-span-2 md:col-span-1">
              Tenure
              <input className="input-field mt-2" type="number" value={tenure} onChange={(event) => setTenure(Number(event.target.value))} />
            </label>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {[
              ['Monthly EMI', format(result.emi)],
              ['Total Interest', format(result.totalInterest)],
              ['Total Amount', format(result.totalAmount)],
            ].map(([label, value], index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06, duration: 0.4 }}
                whileHover={{ y: -3 }}
                className="rounded-3xl bg-[#F8F8F7] p-5 transition-shadow duration-300 hover:shadow-md"
              >
                <Calculator size={18} className="mb-3 text-[#0F766E]" />
                <div className="text-sm text-[#6B7280]">{label}</div>
                <div className="mt-1 text-xl font-extrabold text-[#134E4A] sm:text-2xl">{value}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
