def best_discount_calculation(cart, discounts):
    best_discount = {"name": "", "amount": 0}

    for dis_rule in discounts:
        rule_dis = 0

        if dis_rule["type"] == "flat_10_discount" and cart["total"] > 200:
            rule_dis = 10

        elif dis_rule["type"] == "bulk_5_discount":
            for product in cart["products"]:
                if product["quantity"] > 10:
                    rule_dis += product["price"] * product["quantity"] * 0.05

        elif dis_rule["type"] == "bulk_10_discount" and cart["total_quantity"] > 20:
            rule_dis = cart["total"] * 0.1

        elif dis_rule["type"] == "tiered_50_discount" and cart["total_quantity"] > 30:
            for product in cart["products"]:
                if product["quantity"] > 15:
                    rule_dis += product["price"] * (product["quantity"] - 15) * 0.5

        if rule_dis > best_discount["amount"]:
            best_discount["amount"] = rule_dis
            best_discount["name"] = dis_rule["name"]

    return best_discount


def shipping_cost_calculation(cart):
    return (cart["total_quantity"] + 9) // 10 * 5


def display_cart_details(cart, discounts):
    print("Product\tQuantity\tTotal")
    for product in cart["products"]:
        print(f"{product['name']}\t{product['quantity']}\t\t${product['total']:.2f}")

    print("\nSubtotal: ${:.2f}".format(cart["total"]))

    discount = best_discount_calculation(cart, discounts)
    if discount["amount"] > 0:
        print("Discount ({}): -${:.2f}".format(discount["name"], discount["amount"]))
        cart["disc_name"] = discount["name"]
        cart["disc_amount"] = discount["amount"]

    print("Shipping Fee: ${:.2f}".format(cart["shipping_cost"]))
    print("Gift Wrap Fee: ${:.2f}".format(cart["gift_wrap_cost"]))

    total_amount = cart["total"] - cart["disc_amount"] + cart["shipping_cost"] + cart["gift_wrap_cost"]
    print("\nTotal: ${:.2f}".format(total_amount))


def main():
    products = [
        {"name": "Product A", "price": 20},
        {"name": "Product B", "price": 40},
        {"name": "Product C", "price": 50}
    ]

    discounts = [
        {"name": "Flat $10 Discount", "type": "flat_10_discount"},
        {"name": "Bulk 5% Discount", "type": "bulk_5_discount"},
        {"name": "Bulk 10% Discount", "type": "bulk_10_discount"},
        {"name": "Tiered 50% Discount", "type": "tiered_50_discount"}
    ]

    cart = {
        "products": [],
        "total": 0,
        "total_quantity": 0,
        "disc_amount": 0,
        "disc_name": "",
        "shipping_cost": 0,
        "gift_wrap_cost": 0
    }

    for product in products:
        quantity = int(input(f"Enter quantity for {product['name']}: "))
        is_gift_wrapped = input(f"Is {product['name']} wrapped as a gift? (yes/no): ").lower() == "yes"
        total_amount = product["price"] * quantity

        product_total = total_amount + quantity if is_gift_wrapped else total_amount
        gift_wrap_cost = quantity if is_gift_wrapped else 0

        cart["products"].append({
            "name": product["name"],
            "quantity": quantity,
            "price": product["price"],
            "total": product_total
        })

        cart["total"] += product_total
        cart["total_quantity"] += quantity
        cart["gift_wrap_cost"] += gift_wrap_cost

    cart["disc_amount"] = best_discount_calculation(cart, discounts)["amount"]
    cart["shipping_cost"] = shipping_cost_calculation(cart)

    display_cart_details(cart, discounts)


if __name__ == "__main__":
    main()
