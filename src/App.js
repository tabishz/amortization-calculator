// import { setSelectionRange } from "@testing-library/user-event/dist/utils";
import './App.css';
import React, { Component } from 'react';
// import ReactDOM from 'react-dom';

const DEFAULT_LOAN_AMOUNT = 830000;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loanAmount: DEFAULT_LOAN_AMOUNT,
      loanAmountSlider: DEFAULT_LOAN_AMOUNT,
      interest: 3.7,
      frequency: 12,
      years: 1,
      totalInterestPaid: 0,
    };
  }

  updateValue = async (e) => {
    console.log(`Setting ${e.target.id} = ${e.target.value}`);
    await this.setState({ [e.target.id]: e.target.value });
    if (this.state.loanAmount != this.state.loanAmountSlider) {
      this.setState({ loanAmount: this.state.loanAmountSlider });
    }
    await this.doCalc();
    return;
  };

  reset = async () => {
    await this.setState({
      loanAmount: DEFAULT_LOAN_AMOUNT,
      loanAmountSlider: DEFAULT_LOAN_AMOUNT,
      interest: 3.9,
      frequency: 12,
      years: 1,
      totalInterestPaid: 0,
      paymentAmount: 8501.29,
      alternatePayment: null,
    });
    const altPayment = document.getElementById('alternatePayment');
    altPayment.value = '';
    await this.doCalc();
    return;
  };

  doCalc = async () => {
    if (
      this.state.loanAmount &&
      this.state.interest &&
      this.state.frequency &&
      this.state.years
    ) {
      const frequency = parseInt(this.state.frequency);
      const years = parseInt(this.state.years);
      const interest = parseFloat(this.state.interest);
      const loanAmount = parseFloat(this.state.loanAmount);
      const effInt = interest / 100 / frequency;
      const totalNumOfPayments = frequency * years;
      const altPayment = document.getElementById('alternatePayment').value;
      if (altPayment) await this.setState({ alternatePayment: altPayment });
      let paymentAmount =
        loanAmount *
        ((effInt * Math.pow(1 + effInt, totalNumOfPayments)) /
          (Math.pow(1 + effInt, totalNumOfPayments) - 1));
      if (this.state.alternatePayment) {
        paymentAmount = this.state.alternatePayment;
      }
      const rows = [];
      let remainingPrincipal = loanAmount;
      let principalAmount = 0;
      let totalInterestPaid = 0;
      let actualNumOfPayments = 0;
      let cumulativeInterest = 0;

      for (let i = 1; i <= totalNumOfPayments; i++) {
        remainingPrincipal = remainingPrincipal - principalAmount;
        const interestAmount = effInt * remainingPrincipal;
        principalAmount = paymentAmount - interestAmount;
        totalInterestPaid = totalInterestPaid + interestAmount;
        cumulativeInterest = cumulativeInterest + interestAmount;
        actualNumOfPayments++;
        rows.push(
          <ItemRow
            key={'r' + i}
            paymentNumber={i}
            payment={paymentAmount}
            principalAmount={principalAmount}
            interestAmount={interestAmount}
            cumulativeInterest={cumulativeInterest}
            remainingPrincipal={remainingPrincipal}
          />
        );
        if (remainingPrincipal <= principalAmount) break;
      }
      if (actualNumOfPayments < totalNumOfPayments) {
        this.setState({ years: actualNumOfPayments / frequency });
      }
      await this.setState({
        totalNumOfPayments: actualNumOfPayments,
        payment: paymentAmount,
        effInt: effInt,
        rows: rows,
        totalInterestPaid: totalInterestPaid,
      });
    }
  };

  amortizationTable() {
    return (
      <table
        className="amortization"
        id="amortizationSchedule"
        width="95%"
        align="center"
      >
        <thead>
          <tr>
            <th className="amortization">Payment Number</th>
            <th className="amortization">Payment Amount</th>
            <th className="amortization">Principal Amount</th>
            <th className="amortization">Interest Amount</th>
            <th className="amortization">Cumulative Interest</th>
            <th className="amortization">Remaining Principal</th>
          </tr>
        </thead>
        <tbody>{this.state.rows}</tbody>
      </table>
    );
  }

  componentDidMount() {
    this.doCalc();
  }

  render() {
    const numForm = new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    });
    const yearsFormat = new Intl.NumberFormat('en-CA', {
      maximumSignificantDigits: 2,
    });
    return (
      <div className="App">
        <div className="valuesBlock">
          <label>
            Loan Amount:
            <input
              type="number"
              id="loanAmount"
              step="1000"
              placeholder={numForm.format(this.state.loanAmount)}
              value={this.state.loanAmount}
              onChange={this.updateValue}
            ></input>
          </label>
          <br />
          <div className="slidecontainer">
            <input
              className="slider"
              type="range"
              id="loanAmountSlider"
              min="1000"
              max="1000000"
              step="1000"
              value={this.state.loanAmountSlider}
              onChange={this.updateValue}
            ></input>
          </div>
          <br />
          <label>
            Interest Rate:
            <input
              type="number"
              id="interest"
              placeholder="3.9%"
              step="0.1"
              value={this.state.interest}
              onChange={this.updateValue}
            ></input>
          </label>
          <br />
          <label>
            Payment Amount:
            <input
              type="number"
              id="alternatePayment"
              value={this.state.alternatePayment}
              step="1"
              placeholder={numForm.format(this.state.payment)}
            ></input>
          </label>
          <br />
          <label>
            Payment Frequency:
            <select
              id="frequency"
              value={this.state.frequency}
              onChange={this.updateValue}
            >
              <option value="12">Monthly</option>
              <option value="26">Bi-Weekly</option>
              <option value="52">Weekly</option>
            </select>
          </label>
          <br />
          <label>
            Amortization Years: <strong>{this.state.years}</strong>
          </label>
          <br />
          <div className="slidecontainer">
            <input
              className="slider"
              type="range"
              id="years"
              min="1"
              max="30"
              step="1"
              value={this.state.years}
              onChange={this.updateValue}
            ></input>
          </div>
          <br />
          <button onClick={this.doCalc}>Calculate</button>
          <button onClick={this.reset}>Reset</button>
          <table className="info" align="center">
            <tbody>
              <tr>
                <td className="titles">Loan Value:</td>
                <td>{numForm.format(this.state.loanAmount)}</td>
              </tr>
              <tr>
                <td className="titles">Interest Rate:</td>
                <td>{this.state.interest}%</td>
              </tr>
              <tr>
                <td className="titles">Payment Per Year:</td>
                <td>{this.state.frequency} payments / year</td>
              </tr>
              <tr>
                <td className="titles">Amortization Period:</td>
                <td>
                  {yearsFormat.format(this.state.years)}{' '}
                  {this.state.years > 1 ? 'years' : 'year'}
                </td>
              </tr>
              <tr>
                <td className="titles">Periodic Payment Amount:</td>
                <td>{numForm.format(this.state.payment)}</td>
              </tr>
              <tr>
                <td className="titles">Total Number of Payments:</td>
                <td>{this.state.totalNumOfPayments}</td>
              </tr>
              <tr>
                <td className="titles">Total Interest Paid:</td>
                <td>{numForm.format(this.state.totalInterestPaid)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>{this.amortizationTable()}</div>
      </div>
    );
  }
}

class ItemRow extends Component {
  render() {
    const item = this.props;
    const numForm = new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    });
    return (
      <tr className="amortization">
        <td>{item.paymentNumber}</td>
        <td className="payment">
          {numForm.format(item.payment)}
          <img
            className="lumpsum"
            alt="add lump sum payment"
            src="plus.svg"
            height="20px"
          />
        </td>
        <td>{numForm.format(item.principalAmount)}</td>
        <td>{numForm.format(item.interestAmount)}</td>
        <td>{numForm.format(item.cumulativeInterest)}</td>
        <td>{numForm.format(item.remainingPrincipal)}</td>
      </tr>
    );
  }
}

export default App;
