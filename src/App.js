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
      const paymentAmount = loanAmount * ((effInt * Math.pow(1+effInt,totalNumOfPayments)/
          (Math.pow(1+effInt,totalNumOfPayments) - 1)));
      await this.setState({
        totalNumOfPayments: totalNumOfPayments,
        payment: paymentAmount,
        effInt: effInt,
      });
    }
  };

  amortizationTable() {
    return(
      <table id="amortizationSchedule" width="95%" align="center">
        <thead>
          <tr>
            <th>Payment Number</th>
            <th>Payment Amount</th>
            <th>Principal Amount</th>
            <th>Interest Amount</th>
            <th>Remaining Principal</th>
          </tr>
        </thead>
        <tbody>
          {this.renderRows()}
        </tbody>
      </table>
    );
  };

  renderRows() {
    if (!this.state.payment) return;
    const rows= [];
    let remainingPrincipal = parseFloat(this.state.loanAmount);
    let principalAmount = 0;

    for (let i=1; i<=this.state.totalNumOfPayments; i++) {
      remainingPrincipal = remainingPrincipal - principalAmount;
      const interestAmount = this.state.effInt * remainingPrincipal;
      principalAmount = this.state.payment - interestAmount;
      rows.push(
        <ItemRow
          key={'r'+i}
          paymentNumber={i}
          payment={this.state.payment} 
          principalAmount={principalAmount}
          interestAmount={interestAmount}
          remainingPrincipal={remainingPrincipal}
        />
      );
      if (remainingPrincipal <= principalAmount) break;
    }
    return(rows);
  }

  componentDidMount() {
    this.doCalc();
  };

  render() {
    const numForm = new Intl.NumberFormat('en-CA', {style: 'currency', currency: 'CAD'});
    return (
      <div className="App">
        <label>Loan Amount: </label>
        <input type="number" id="loanAmount" placeholder="100000" onChange={this.updateValue}></input>
        <br />
        <label>Interest Rate: </label>
        <input type="number" id="interest" placeholder="3.7%" onChange={this.updateValue}></input>
        <br />
        <label>Payment Amount: </label>
        <input type="number" id="payment" onChange={this.updateValue}></input>
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
        <button onClick={this.updateValue}>Calculate!</button>
        <p>
          Loan Value: {numForm.format(this.state.loanAmount)}<br />
          Interest Rate: {this.state.interest}%<br />
          Payment Per Year: {this.state.frequency}<br />
          Amortization Period: {this.state.years}<br />
          Periodic Payment Amount: {numForm.format(this.state.payment)}<br />
          Total Number of Payments: {this.state.totalNumOfPayments}<br />
        </p>
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
      <tr>
        <td>{item.paymentNumber}</td>
        <td>{numForm.format(item.payment)}</td>
        <td>{numForm.format(item.principalAmount)}</td>
        <td>{numForm.format(item.interestAmount)}</td>
        <td>{numForm.format(item.remainingPrincipal)}</td>
      </tr>
    );
  }
}

export default App;
