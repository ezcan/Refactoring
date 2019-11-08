// plays.json
const plays = {
  "hamlet": {
    "name": "Hamlet",
    "type": "tragedy"
  },
  "as-like": {
    "name": "As You Like It",
    "type": "comedy"
  },
  "othello": {
    "name": "Othello",
    "type": "tragedy"
  }
}

// invoices.json
const invoices = {
  "customer": "BigCo",
  "performances": [
    {
      "playID": "hamlet",
      "audience": 55
    },
    {
      "playID": "as-like",
      "audience": 35
    },
    {
      "playID": "othello",
      "audience": 40
    }
  ]
}

// =============================================================================
class Plays {
  // 簡單工廠模式
  static create(type, audience = 0) {
    const list = {
      tragedy: Tragedy,
      comedy: Comedy
    }
    return new list[type](audience)
  }

  constructor(audience) {
    this.baseAmount = 0
    this.audience = audience || 0
  }

  getCredit(audience) {
    return Math.max(this.audience - 30, 0)
  }
}

class Tragedy extends Plays {
  constructor(audience) {
    super(audience)
    this.baseAmount = 40000
  }

  getAmoumt() {
    let baseBonus = Math.max(this.audience - 30, 0) * 1000
    return this.baseAmount + baseBonus
  }
}

class Comedy extends Plays {
  constructor(audience) {
    super(audience)
    this.baseAmount = 30000
  }

  getAmoumt() {
    let baseBonus = this.audience * 300
    let extraBonus = this.audience < 20 ? 0 : Math.max(this.audience - 20) * 500 + 10000
    return this.baseAmount + baseBonus + extraBonus
  }

  getCredit() {
    return Math.max(this.audience - 30, 0) + Math.floor(this.audience / 5)
  }
}

function USD(amount) {
  const format = new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2
    }
  ).format;
  return format(amount / 100)
}

// main function
function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}\n`
  for (let perf of invoice.performances) {
    const { type, name } = plays[perf.playID];
    let play = Plays.create(type, perf.audience)
    let amount = play.getAmoumt()
    // 印出這筆訂單
    result += `${name}: ${USD(amount)} (${perf.audience} seats)\n`;
    volumeCredits += play.getCredit()
    totalAmount += amount;
  }
  result += `Amount owed is ${USD(totalAmount)}\n`;
  result += `You earned ${volumeCredits} credits\n`;
  return result;
}

console.log(statement(invoices, plays))