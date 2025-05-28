// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IERC20 {
    function transferFrom(
        address from,
        address to,
        uint amount
    ) external returns (bool);

    function transfer(address to, uint amount) external returns (bool);
}

contract TuitionEscrow {
    address public admin;
    IERC20 public stablecoin;

    struct Payment {
        address payer;
        uint amount;
        string institution;
        bool released;
    }

    uint public paymentId = 0;
    mapping(uint => Payment) public payments;

    constructor(address _stablecoin) {
        admin = msg.sender;
        stablecoin = IERC20(_stablecoin);
    }

    event PaymentMade(uint id, address payer, uint amount, string institution);
    event PaymentReleased(uint id, string institution, address to);

    function makePayment(uint amount, string calldata institution) external {
        stablecoin.transferFrom(msg.sender, address(this), amount);
        payments[paymentId] = Payment(msg.sender, amount, institution, false);
        emit PaymentMade(paymentId, msg.sender, amount, institution);
        paymentId++;
    }

    function releasePayment(uint id, address to) external {
        require(msg.sender == admin, "Not admin");
        Payment storage p = payments[id];
        require(!p.released, "Already released");

        p.released = true;
        stablecoin.transfer(to, p.amount);

        emit PaymentReleased(id, p.institution, to);
    }
}
