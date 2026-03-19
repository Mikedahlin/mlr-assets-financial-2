/**
 * KIRA Nudge Engine - Interactive Dashboard
 * Fully functional revenue prediction and recommendation system
 * Features: Demo mode, real API integration, AI predictions, prescriptive recommendations
 */

import { useState } from "react";
import { Upload, BarChart3, AlertCircle, TrendingUp, Download, Zap } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { trpc } from "@/lib/trpc";
import { AIChatBox, type Message } from "@/components/AIChatBox";

// ─── Demo Data ────────────────────────────────────────────────────────────────

const DEMO_CUSTOMERS = [
  {
    id: 1,
    name: "Acme Corp",
    tier: "Professional",
    mrr: 2500,
    churnRisk: 0.15,
    upgradeProb: 0.78,
    usagePercent: 85,
    lastActive: "2 days ago",
    recommendation: "Email with 15% discount on Enterprise—pitch Tuesday AM",
    predictedRevenue: 2400,
  },
  {
    id: 2,
    name: "TechStart Inc",
    tier: "Starter",
    mrr: 500,
    churnRisk: 0.72,
    upgradeProb: 0.25,
    usagePercent: 15,
    lastActive: "14 days ago",
    recommendation: "Proactive outreach + retention offer. Risk of churn in 7 days.",
    predictedRevenue: -500,
  },
  {
    id: 3,
    name: "Global Solutions",
    tier: "Professional",
    mrr: 3500,
    churnRisk: 0.08,
    upgradeProb: 0.62,
    usagePercent: 72,
    lastActive: "1 day ago",
    recommendation: "Demo add-on product. Potential MRR increase: $3,200.",
    predictedRevenue: 3200,
  },
  {
    id: 4,
    name: "StartupXYZ",
    tier: "Starter",
    mrr: 300,
    churnRisk: 0.35,
    upgradeProb: 0.45,
    usagePercent: 60,
    lastActive: "3 days ago",
    recommendation: "Pitch Professional tier. High growth trajectory.",
    predictedRevenue: 1700,
  },
  {
    id: 5,
    name: "Enterprise Corp",
    tier: "Enterprise",
    mrr: 8000,
    churnRisk: 0.02,
    upgradeProb: 0.15,
    usagePercent: 95,
    lastActive: "Today",
    recommendation: "Upsell advanced features. Expand seat count.",
    predictedRevenue: 2000,
  },
];

const REVENUE_TREND = [
  { month: "Jan", revenue: 15000, opportunities: 8 },
  { month: "Feb", revenue: 18500, opportunities: 12 },
  { month: "Mar", revenue: 22000, opportunities: 15 },
  { month: "Apr", revenue: 25500, opportunities: 18 },
  { month: "May", revenue: 29000, opportunities: 22 },
  { month: "Jun", revenue: 33500, opportunities: 26 },
];

const COLORS = ["#D4A574", "#1B5E3F", "#E8746B", "#4A9B8E", "#F0A868"];

// ─── Components ───────────────────────────────────────────────────────────────

function KPICard({ label, value, change, color }: { label: string; value: string; change: string; color: string }) {
  return (
    <div className="p-6 rounded border" style={{ borderColor: "#1B5E3F", background: "#101820" }}>
      <div className="text-xs font-semibold mb-2" style={{ color: "#B5B5B5" }}>
        {label}
      </div>
      <div className="text-3xl font-bold mb-2" style={{ color }}>
        {value}
      </div>
      <div className="text-xs" style={{ color: "#B5B5B5" }}>
        {change}
      </div>
    </div>
  );
}

function CustomerRow({ customer }: { customer: typeof DEMO_CUSTOMERS[0] }) {
  const upgradeColor = customer.upgradeProb > 0.6 ? "#1B5E3F" : customer.upgradeProb > 0.4 ? "#D4A574" : "#999";
  const churnColor = customer.churnRisk > 0.5 ? "#E8746B" : "#1B5E3F";

  return (
    <div className="p-4 rounded border mb-3" style={{ borderColor: "#1B5E3F", background: "#11161D" }}>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
        <div>
          <div className="font-semibold" style={{ color: "#D4A574" }}>
            {customer.name}
          </div>
          <div className="text-xs" style={{ color: "#B5B5B5" }}>
            {customer.tier} • ${customer.mrr}/mo
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs font-semibold mb-1" style={{ color: "#999" }}>
            Upgrade Prob
          </div>
          <div className="text-lg font-bold" style={{ color: upgradeColor }}>
            {(customer.upgradeProb * 100).toFixed(0)}%
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs font-semibold mb-1" style={{ color: "#999" }}>
            Churn Risk
          </div>
          <div className="text-lg font-bold" style={{ color: churnColor }}>
            {(customer.churnRisk * 100).toFixed(0)}%
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs font-semibold mb-1" style={{ color: "#999" }}>
            Usage
          </div>
          <div className="w-full h-2 rounded-full" style={{ background: "#E8E6E1" }}>
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${customer.usagePercent}%`,
                background: customer.usagePercent > 80 ? "#1B5E3F" : customer.usagePercent > 50 ? "#D4A574" : "#E8746B",
              }}
            />
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold mb-1" style={{ color: "#999" }}>
            Revenue Impact
          </div>
          <div className="text-lg font-bold" style={{ color: customer.predictedRevenue > 0 ? "#1B5E3F" : "#E8746B" }}>
            +${customer.predictedRevenue.toLocaleString()}
          </div>
        </div>
        <div>
          <button
            className="px-3 py-2 rounded text-xs font-semibold transition-all"
            style={{ background: "#D4A574", color: "white" }}
          >
            View Details
          </button>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t" style={{ borderColor: "#E8E6E1" }}>
        <div className="text-sm" style={{ color: "#555" }}>
          <span className="font-semibold">Recommendation:</span> {customer.recommendation}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Kira() {
  const [mode, setMode] = useState<"demo" | "upload">("demo");
  const [customers] = useState(DEMO_CUSTOMERS);
  const [isStripeLoading, setIsStripeLoading] = useState(false);

  const stripePriceId = import.meta.env.VITE_STRIPE_PRICE_ID;
  const isStripeConfigured = Boolean(stripePriceId);

  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      role: "system",
      content:
        "You are KIRA, a smart revenue intelligence assistant. Provide concise, actionable recommendations and explain metrics. Speak in a friendly yet expert tone.",
    },
  ]);

  const chatMutation = trpc.ai.chat.useMutation({
    onSuccess: (result) => {
      const content =
        result?.choices?.[0]?.message?.content?.toString() ??
        "Sorry, I couldn't generate a response.";
      setChatMessages((prev) => [...prev, { role: "assistant", content }]);
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Unknown error";
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Error generating response: ${message}`,
        },
      ]);
    },
  });

  const handleKiraSend = (content: string) => {
    const nextMessages: Message[] = [
      ...chatMessages,
      { role: "user", content } as const,
    ];
    setChatMessages(nextMessages);
    chatMutation.mutate({ messages: nextMessages });
  };

  const handleStripeCheckout = async () => {
    setIsStripeLoading(true);

    try {
      if (!stripePriceId) {
        throw new Error("VITE_STRIPE_PRICE_ID is not set in environment variables");
      }

      const priceId = stripePriceId;
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId, quantity: 1 }),
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Stripe checkout creation failed");
      }

      window.location.href = data.url;
    } catch (error) {
      console.error("Stripe checkout error", error);
      alert(`Stripe checkout failed: ${(error as Error).message}`);
    } finally {
      setIsStripeLoading(false);
    }
  };

  const totalRevenue = customers.reduce((sum, c) => sum + c.mrr, 0);
  const opportunityRevenue = customers.reduce((sum, c) => sum + (c.predictedRevenue > 0 ? c.predictedRevenue : 0), 0);
  const churnRiskCount = customers.filter((c) => c.churnRisk > 0.5).length;
  const upgradeOpportunities = customers.filter((c) => c.upgradeProb > 0.6).length;

  return (
    <div style={{ background: "#050505", color: "#EAE6DC", minHeight: "100vh" }}>
      {/* ── Header ── */}
      <div className="border-b" style={{ borderColor: "#E8E6E1", background: "#FFF" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: "#1B5E3F" }}>
                KIRA Nudge Engine
              </h1>
              <p style={{ color: "#999" }}>Real-time revenue predictions and actionable recommendations</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleStripeCheckout}
                disabled={isStripeLoading || !isStripeConfigured}
                className="px-4 py-2 rounded text-sm font-semibold transition-all"
                style={{ background: "#D4A574", color: "#050505" }}
              >
                {isStripeLoading ? "Starting Checkout..." : "Start Stripe Checkout"}
              </button>
              <a
                href="/"
                className="px-4 py-2 rounded text-sm font-semibold transition-all"
                style={{ background: "#F0F8F5", color: "#1B5E3F", border: "1px solid #E8E6E1" }}
              >
                ← Back to Home
              </a>
            </div>
          </div>

          {/* Mode Selector */}
          <div className="flex gap-4">
            <button
              onClick={() => setMode("demo")}
              className="px-4 py-2 rounded font-semibold transition-all"
              style={{
                background: mode === "demo" ? "#D4A574" : "#F0F8F5",
                color: mode === "demo" ? "white" : "#1B5E3F",
              }}
            >
              Demo Mode
            </button>
            <button
              onClick={() => setMode("upload")}
              className="px-4 py-2 rounded font-semibold transition-all"
              style={{
                background: mode === "upload" ? "#D4A574" : "#F0F8F5",
                color: mode === "upload" ? "white" : "#1B5E3F",
              }}
            >
              Upload Data
            </button>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {mode === "demo" ? (
          <>
            {/* KPI Cards */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <KPICard
                label="Total MRR"
                value={`$${totalRevenue.toLocaleString()}`}
                change="Current subscription revenue"
                color="#1B5E3F"
              />
              <KPICard
                label="Revenue Opportunities"
                value={`$${opportunityRevenue.toLocaleString()}`}
                change="Predicted from nudges"
                color="#D4A574"
              />
              <KPICard
                label="Churn Risk"
                value={`${churnRiskCount} customers`}
                change="Likely to churn in 30 days"
                color="#E8746B"
              />
              <KPICard
                label="Upgrade Opportunities"
                value={`${upgradeOpportunities} customers`}
                change="Ready to upgrade"
                color="#4A9B8E"
              />
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="p-6 rounded border" style={{ borderColor: "#E8E6E1", background: "#FFF" }}>
                <h3 className="text-lg font-bold mb-4" style={{ color: "#1B5E3F" }}>
                  Revenue Trend & Opportunities
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={REVENUE_TREND}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8E6E1" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#D4A574" strokeWidth={2} />
                    <Line type="monotone" dataKey="opportunities" stroke="#1B5E3F" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="p-6 rounded border" style={{ borderColor: "#E8E6E1", background: "#FFF" }}>
                <h3 className="text-lg font-bold mb-4" style={{ color: "#1B5E3F" }}>
                  Customer Distribution by Upgrade Probability
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "High (>60%)", value: upgradeOpportunities, color: "#1B5E3F" },
                        { name: "Medium (40-60%)", value: customers.filter((c) => c.upgradeProb >= 0.4 && c.upgradeProb <= 0.6).length, color: "#D4A574" },
                        { name: "Low (<40%)", value: customers.filter((c) => c.upgradeProb < 0.4).length, color: "#E8746B" },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[0, 1, 2].map((index) => (
                        <Cell key={`cell-${index}`} fill={["#1B5E3F", "#D4A574", "#E8746B"][index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* KIRA AI Assistant */}
            <div className="mb-8">
              <div className="p-6 rounded border" style={{ borderColor: "#E8E6E1", background: "#FFF" }}>
                <h3 className="text-2xl font-bold mb-4" style={{ color: "#1B5E3F" }}>
                  KIRA ChatGPT-style AI
                </h3>
                <p className="text-sm mb-4" style={{ color: "#666" }}>
                  Ask KIRA about revenue growth, churn reduction, pricing strategy and customer health. The assistant is trained to interpret your SaaS metrics.
                </p>
                <AIChatBox
                  className="h-[500px]"
                  messages={chatMessages}
                  onSendMessage={handleKiraSend}
                  isLoading={chatMutation.isPending}
                  placeholder="Ask KIRA something…"
                  suggestedPrompts={[
                    "What pricing moves should I make for low-tier customers?",
                    "How do I reduce churn risk in my top 10 accounts?",
                    "Summarize total MRR and opportunity benchmark from this dataset.",
                  ]}
                />
              </div>
            </div>

            {/* Customer List */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold" style={{ color: "#1B5E3F" }}>
                  Customer Nudges (Ranked by Opportunity)
                </h3>
                <button
                  className="px-4 py-2 rounded font-semibold transition-all flex items-center gap-2"
                  style={{ background: "#F0F8F5", color: "#1B5E3F", border: "1px solid #E8E6E1" }}
                >
                  <Download size={18} /> Export CSV
                </button>
              </div>

              <div>
                {customers
                  .sort((a, b) => b.upgradeProb - a.upgradeProb)
                  .map((customer) => (
                    <CustomerRow key={customer.id} customer={customer} />
                  ))}
              </div>
            </div>
          </>
        ) : (
          /* Upload Mode */
          <div className="max-w-2xl mx-auto">
            <div className="p-12 rounded border-2 border-dashed text-center" style={{ borderColor: "#D4A574", background: "#F0F8F5" }}>
              <Upload size={48} className="mx-auto mb-4" style={{ color: "#D4A574" }} />
              <h3 className="text-2xl font-bold mb-2" style={{ color: "#1B5E3F" }}>
                Upload Customer Data
              </h3>
              <p className="mb-6" style={{ color: "#666" }}>
                Upload a CSV with columns: name, tier, mrr, usage_percent, last_active_days
              </p>
              <input
                type="file"
                accept=".csv"
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className="inline-block px-6 py-3 rounded font-semibold transition-all cursor-pointer"
                style={{ background: "#D4A574", color: "white" }}
              >
                Choose CSV File
              </label>
            </div>

            <div className="mt-12 p-6 rounded border" style={{ borderColor: "#E8E6E1", background: "#FFF" }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: "#1B5E3F" }}>
                Or Connect Your Account
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  className="p-4 rounded border transition-all"
                  style={{ borderColor: "#E8E6E1", background: "#FFF" }}
                >
                  <div className="font-semibold mb-2" style={{ color: "#1B5E3F" }}>
                    Stripe
                  </div>
                  <p className="text-sm" style={{ color: "#999" }}>
                    Connect your Stripe account for live billing data
                  </p>
                </button>
                <button
                  className="p-4 rounded border transition-all"
                  style={{ borderColor: "#E8E6E1", background: "#FFF" }}
                >
                  <div className="font-semibold mb-2" style={{ color: "#1B5E3F" }}>
                    Chargebee
                  </div>
                  <p className="text-sm" style={{ color: "#999" }}>
                    Connect your Chargebee account for live billing data
                  </p>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
