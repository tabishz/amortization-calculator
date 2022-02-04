import './App.css';
import React, {Component} from 'react';
// import ReactDOM from 'react-dom';

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      loanAmount: 0,
      interest: 3.7,
      frequency: 12,
      years: 1,
    };
  }

  updateValue = (e) => {
    console.log(`Setting ${e.target.id} = ${e.target.value}`);
    this.setState({[e.target.id]: e.target.value});
    if (this.state.loanAmount && this.state.interest && this.state.frequency && this.state.years) {
      console.log('calculating...');
      this.setState({frequency: parseInt(this.state.frequency)});
      const effectiveInterest = this.state.interest / this.state.frequency;
      const totalNumOfPayments = this.state.frequency * this.state.years;
      const paymentAmount = this.state.loanAmount * ((effectiveInterest *
          (1+effectiveInterest)^totalNumOfPayments) /
          (((1+effectiveInterest)^totalNumOfPayments) - 1));
      this.setState({totalNumOfPayments: totalNumOfPayments,
          payment: paymentAmount, effectiveInterest: effectiveInterest,
      });
    }
    return;
  };

  amortizationTable() {
    return(
      <table id="amortizationSchedule" width="95%">
        <thead key='r0'>
          <tr>
            <th key='p0'>Payment Number</th>
            <th key='pa0'>Payment Amount</th>
            <th key='prin0'>Principal Amount</th>
            <th key='intre0'>Interest Amount</th>
            <th key='rem0'>Remaining Principal</th>
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
    let remainingPrincipal = this.state.loanAmount;
    let principalAmount = 0;

    for (let i=1; i<=this.state.totalNumOfPayments; i++) {
      remainingPrincipal = remainingPrincipal - principalAmount;
      const interestAmount = this.state.effectiveInterest * this.remainingPrincipal;
      principalAmount = this.state.payment - interestAmount;
      rows.push(
        <ItemRow 
            paymentNumber={i}
            payment={this.state.payment} 
            principalAmount={principalAmount}
            interestAmount={interestAmount}
            remainingPrincipal={remainingPrincipal}
        />
      );
    }
    return(rows);
  }

  render() {
    return (
      <div className="App">
        <label>Loan Amount: </label>
        <input type="number" id="loanAmount" onChange={this.updateValue}></input>
        <br />
        <label>Interest Rate: </label>
        <input type="number" id="interest" placeholder="3%" onChange={this.updateValue}></input>
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
        <p>
          Loan Value: ${this.state.loanAmount}<br />
          Interest Rate: {this.state.interest}%<br />
          Payment Per Year: {this.state.frequency}<br />
          Amortization Period: {this.state.years}<br />
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
    return(
      <tr key={'row'+ item.paymentNumber}>
        <td key={'p' + item.paymentNumber}>{item.paymentNumber}</td>
        <td key={'pay' + item.paymentNumber}>{item.payment}</td>
        <td key={'prin' + item.paymentNumber}>{item.principalAmount}</td>
        <td key={'intre' + item.paymentNumber}>{item.interestAmount}</td>
        <td key={'rem' + item.paymentNumber}>{item.remainingPrincipal}</td>
      </tr>
    );
  }
}

export default App;
