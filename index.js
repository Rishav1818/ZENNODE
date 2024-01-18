const readline = require("readline");

function bestDiscountCalculation(cart, discounts) {
    let bestDiscount = { name: "", amount: 0 };

    for (const disRule of discounts) {
        let ruleDis = 0;

        switch (disRule.type) {
            case "flat_10_discount":
                if (cart.total > 200) {
                    ruleDis = 10;
                }
                break;
            case "bulk_5_discount":
                for (const product of cart.products) {
                    if (product.quantity > 10) {
                        ruleDis += (product.price * product.quantity * 0.05);
                    }
                }
                break;
            case "bulk_10_discount":
                if (cart.totalQuantity > 20) {
                    ruleDis = cart.total * 0.1;
                }
                break;
            case "tiered_50_discount":
                if (cart.totalQuantity > 30) {
                    for (const product of cart.products) {
                        if (product.quantity > 15) {
                            ruleDis += (product.price * (product.quantity - 15) * 0.5);
                        }
                    }
                }
                break;
        }

        if (ruleDis > bestDiscount.amount) {
            bestDiscount.amount = ruleDis;
            bestDiscount.name = disRule.name;
        }
    }

    return bestDiscount;
}

function shippingCostCalculation(cart) {
    return Math.ceil(cart.totalQuantity / 10) * 5;
}

function displayCartDetails(cart, discounts) {
    console.log("Product\tQuantity\tTotal");
    cart.products.forEach(product => {
        console.log(`${product.name}\t${product.quantity}\t\t$${product.total.toFixed(2)}`);
    });

    console.log("\nSubtotal: $" + cart.total.toFixed(2));

    const discount = bestDiscountCalculation(cart, discounts);
    if (discount.amount > 0) {
        console.log(`Discount (${discount.name}): -$${discount.amount.toFixed(2)}`);
        cart.discName = discount.name;
        cart.discAmount = discount.amount;
    }

    console.log(`Shipping Fee: $${cart.shippingCost.toFixed(2)}`);
    console.log(`Gift Wrap Fee: $${cart.giftWrapCost.toFixed(2)}`);

    const totalAmount = cart.total - cart.discAmount + cart.shippingCost + cart.giftWrapCost;
    console.log(`\nTotal: $${totalAmount.toFixed(2)}`);
}

async function askQuestion(question) {
    return new Promise(resolve => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question(question, answer => {
            rl.close();
            resolve(answer.trim());
        });
    });
}

async function main() {
    const products = [
        { name: "Product A", price: 20 },
        { name: "Product B", price: 40 },
        { name: "Product C", price: 50 }
    ];

    const discounts = [
        { name: "Flat $10 Discount", type: "flat_10_discount" },
        { name: "Bulk 5% Discount", type: "bulk_5_discount" },
        { name: "Bulk 10% Discount", type: "bulk_10_discount" },
        { name: "Tiered 50% Discount", type: "tiered_50_discount" }
    ];

    const cart = {
        products: [],
        total: 0,
        totalQuantity: 0,
        discAmount: 0,
        discName: "",
        shippingCost: 0,
        giftWrapCost: 0
    };

    for (const product of products) {
        const quantity = parseInt(await askQuestion(`Enter quantity for ${product.name}: `), 10);
        const isGiftWrapped = (await askQuestion(`Is ${product.name} wrapped as a gift? (yes/no): `)).toLowerCase() === "yes";
        const totalAmount = product.price * quantity;

        const productTotal = isGiftWrapped ? totalAmount + quantity : totalAmount;
        const giftWrapCost = isGiftWrapped ? quantity * 1 : 0;

        cart.products.push({
            name: product.name,
            quantity: quantity,
            price: product.price,
            total: productTotal
        });

        cart.total += productTotal;
        cart.totalQuantity += quantity;
        cart.giftWrapCost += giftWrapCost;
    }

    cart.discAmount = bestDiscountCalculation(cart, discounts).amount;
    cart.shippingCost = shippingCostCalculation(cart);

    displayCartDetails(cart, discounts);
}

main();
