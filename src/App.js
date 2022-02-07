import './App.css';
import React, {Component} from 'react';
// import ReactDOM from 'react-dom';

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      loanAmount: 100000,
      interest: 3.7,
      frequency: 12,
      years: 1,
      totalInterestPaid: 0,
    };
  }

  updateValue = async (e) => {
    // console.log(`Setting ${e.target.id} = ${e.target.value}`);
    await this.setState({[e.target.id]: e.target.value});
    await this.doCalc();
    return;
  };

  doCalc = async() => {
    if (this.state.loanAmount && this.state.interest && this.state.frequency && this.state.years) {
      const frequency = parseInt(this.state.frequency);
      const years = parseInt(this.state.years);
      const interest = parseFloat(this.state.interest);
      const loanAmount = parseFloat(this.state.loanAmount);
      const effInt = (interest/100) / frequency;
      const totalNumOfPayments = frequency * years;
      let paymentAmount = loanAmount * ((effInt * Math.pow(1+effInt,totalNumOfPayments)/
          (Math.pow(1+effInt,totalNumOfPayments) - 1)));
      if (this.state.alternatePayment) paymentAmount = this.state.alternatePayment;
      const rows= [];
      let remainingPrincipal = loanAmount;
      let principalAmount = 0;
      let totalInterestPaid = 0;
      let actualNumOfPayments = 0;
  
      for (let i=1; i<=totalNumOfPayments; i++) {
        remainingPrincipal = remainingPrincipal - principalAmount;
        const interestAmount = effInt * remainingPrincipal;
        principalAmount = paymentAmount - interestAmount;
        totalInterestPaid = totalInterestPaid + interestAmount;
        actualNumOfPayments++;
        rows.push(
          <ItemRow
            key={'r'+i}
            paymentNumber={i}
            payment={paymentAmount} 
            principalAmount={principalAmount}
            interestAmount={interestAmount}
            remainingPrincipal={remainingPrincipal}
          />
        );
        if (remainingPrincipal <= principalAmount) break;
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
    return(
      <table className="amortization" id="amortizationSchedule" width="95%" align="center">
        <thead>
          <tr>
            <th className="amortization">Payment Number</th>
            <th className="amortization">Payment Amount</th>
            <th className="amortization">Principal Amount</th>
            <th className="amortization">Interest Amount</th>
            <th className="amortization">Remaining Principal</th>
          </tr>
        </thead>
        <tbody>
          {this.state.rows}
        </tbody>
      </table>
    );
  };

  componentDidMount() {
    this.doCalc();
  };

  render() {
    const numForm = new Intl.NumberFormat('en-CA', {style: 'currency', currency: 'CAD'});
    return (
      <div className="App">
        <label>Loan Amount: </label>
        <input type="number" id="loanAmount" placeholder={numForm.format(this.state.loanAmount)} onChange={this.updateValue}></input>
        <br />
        <label>Interest Rate: </label>
        <input type="number" id="interest" placeholder="3.7%" onChange={this.updateValue}></input>
        <br />
        <label>Payment Amount: </label>
        <input type="number" id="alternatePayment" placeholder={numForm.format(this.state.payment)} onChange={this.updateValue}></input>
        <br />
        <label>Payment Frequency: </label>
        <select id="frequency" onChange={this.updateValue}>
          <option value="12">Monthly</option>
          <option value="26">Bi-Weekly</option>
          <option value="52">Weekly</option>          
        </select>
        <br />
        <label>Amortization Years: </label>
        <select id="years" onChange={this.updateValue}>
          <option value="1">1 Year</option>
          <option value="5">5 Years</option>
          <option value="10">10 Years</option>
          <option value="15">15 Years</option>
          <option value="20">20 Years</option>
          <option value="25">25 Years</option>
          <option value="30">30 Years</option>
        </select>
        <br />
        <button onClick={this.doCalc}>Calculate!</button>
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
            <td>{this.state.years} {this.state.years>1 ? 'years' : 'year'}</td>
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
        <div>
          {this.amortizationTable()}
        </div>
      </div>
    );
  }
};

class ItemRow extends Component {
  render() {
    const item = this.props;
    const numForm = new Intl.NumberFormat('en-CA', {style: 'currency', currency: 'CAD'});
    return(
      <tr className="amortization">
        <td>{item.paymentNumber}</td>
        <td className="payment">{numForm.format(item.payment)}<img className="lumpsum" alt="add lump sum payment" src="plus.svg" height="20px" /></td>
        <td>{numForm.format(item.principalAmount)}</td>
        <td>{numForm.format(item.interestAmount)}</td>
        <td>{numForm.format(item.remainingPrincipal)}</td>
      </tr>
    );
  }
}

export default App;
