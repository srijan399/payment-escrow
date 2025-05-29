// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IERC20 {
    function transferFrom(
        address from,
        address to,
        uint amount
    ) external returns (bool);

    function transfer(address to, uint amount) external returns (bool);

    function approve(address spender, uint amount) external returns (bool);

    function allowance(
        address owner,
        address spender
    ) external view returns (uint);
}

contract TuitionEscrow {
    address public admin;
    IERC20 public stablecoin;

    enum PaymentStatus {
        Staged,
        Released,
        Refunded
    }

    struct Payment {
        uint id;
        address payer;
        uint amount;
        string institution;
        bool released;
        string invoiceRef;
        PaymentStatus status;
    }

    uint public paymentId = 0;
    mapping(uint => Payment) public payments;

    constructor(address _stablecoin) {
        admin = msg.sender;
        stablecoin = IERC20(_stablecoin);
    }

    event PaymentMade(
        uint id,
        address payer,
        uint amount,
        string institution,
        string invoiceRef
    );
    event PaymentRefunded(uint id, address payer);
    event PaymentReleased(uint id, string institution, address to);
    event AllowanceInsufficient(address payer, uint required, uint current);

    function deposit(
        uint amount,
        string calldata institution,
        string calldata invoiceRef
    ) external {
        uint currentAllowance = stablecoin.allowance(msg.sender, address(this));

        if (currentAllowance < amount) {
            emit AllowanceInsufficient(msg.sender, amount, currentAllowance);
            revert("Insufficient allowance. Please approve spending first.");
        }

        require(
            stablecoin.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );

        payments[paymentId] = Payment(
            paymentId,
            msg.sender,
            amount,
            institution,
            false,
            invoiceRef,
            PaymentStatus.Staged
        );
        emit PaymentMade(
            paymentId,
            msg.sender,
            amount,
            institution,
            invoiceRef
        );
        paymentId++;
    }

    function checkAllowance(address payer) external view returns (uint) {
        return stablecoin.allowance(payer, address(this));
    }

    function isAllowanceSufficient(
        address payer,
        uint amount
    ) external view returns (bool) {
        return stablecoin.allowance(payer, address(this)) >= amount;
    }

    function release(uint id, address to) external {
        require(msg.sender == admin, "Not admin");
        Payment storage p = payments[id];
        require(!p.released, "Already released");

        p.released = true;
        p.status = PaymentStatus.Released;
        stablecoin.transfer(to, p.amount);

        emit PaymentReleased(id, p.institution, to);
    }

    function refund(uint id) external {
        Payment storage p = payments[id];
        require(msg.sender == admin, "Not admin");
        require(!p.released, "Already released");

        p.status = PaymentStatus.Refunded;
        stablecoin.transfer(p.payer, p.amount);
        delete payments[id];

        emit PaymentRefunded(id, p.payer);
    }

    function getPayments() external view returns (Payment[] memory) {
        Payment[] memory allPayments = new Payment[](paymentId);
        for (uint i = 0; i < paymentId; i++) {
            allPayments[i] = payments[i];
        }
        return allPayments;
    }
}
