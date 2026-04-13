import { formatCurrency } from "@/utils/helper-functions";

type OrderEmailAddress = {
    name?: string;
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode?: string;
    country?: string;
};

type OrderEmailVariant = {
    label: string;
    value: string;
};

type OrderEmailItem = {
    name: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    sku?: string;
    thumbnailUrl?: string;
    variants?: OrderEmailVariant[];
};

type OrderEmailSummary = {
    subtotal: number;
    shipping: number;
    tax: number;
    discount?: number;
    total: number;
};

type OrderEmailFulfillment = {
    type: "shipping" | "pickup" | "local_delivery";
    methodLabel: string;
    expectedWindow: string;
    instructions?: string;
    trackingUrl?: string;
    viewOrderUrl?: string;
    storeHours?: string;
    changeWindowHours?: number;
};

export type OrderConfirmationEmailInput = {
    storeName: string;
    storeTagline?: string;
    orderNumber: string;
    orderedAt: string | Date;
    customerName: string;
    paymentStatus: "Paid" | "Pending" | "Partially Paid" | "Refunded";
    paymentNote?: string;
    items: OrderEmailItem[];
    summary: OrderEmailSummary;
    fulfillment: OrderEmailFulfillment;
    shippingAddress?: OrderEmailAddress;
    billingAddress?: OrderEmailAddress;
    supportEmail: string;
    supportPhone?: string;
    supportHours?: string;
    returnPolicyUrl: string;
    storeUrl?: string;
    logoUrl?: string;
};

export function buildOrderConfirmationSubject(orderNumber: string) {
    return `Your order is confirmed - Order #${orderNumber}`;
}

export function renderOrderConfirmationEmail(input: OrderConfirmationEmailInput) {
    const {
        storeName,
        storeTagline = "Beauty essentials selected with care.",
        orderNumber,
        orderedAt,
        customerName,
        paymentStatus,
        paymentNote,
        items,
        summary,
        fulfillment,
        shippingAddress,
        billingAddress,
        supportEmail,
        supportPhone,
        supportHours,
        returnPolicyUrl,
        storeUrl,
        logoUrl,
    } = input;

    const previewText = `Order #${orderNumber} is confirmed. ${items.length} item${items.length === 1 ? "" : "s"} ${paymentStatus.toLowerCase()} for ${customerName}.`;
    const orderedAtLabel = formatOrderDate(orderedAt);
    const needsShippingAddress = fulfillment.type === "shipping" || fulfillment.type === "local_delivery";
    const actionUrl = fulfillment.trackingUrl ?? fulfillment.viewOrderUrl ?? storeUrl;
    const actionLabel = fulfillment.trackingUrl ? "Track your order" : fulfillment.viewOrderUrl ? "View your order" : "Visit the store";
    const contactLine = [supportEmail, supportPhone].filter(Boolean).join(" • ");

    const itemMarkup = items
        .map((item) => {
            const variantMarkup = item.variants?.length
                ? `
                    <div style="margin-top:8px;">
                        ${item.variants
                            .map(
                                (variant) => `
                                    <span style="display:inline-block; margin:0 6px 6px 0; padding:6px 10px; border-radius:999px; background:#fff0f7; color:#cf0c74; font-size:12px; line-height:16px;">
                                        ${escapeHtml(variant.label)}: ${escapeHtml(variant.value)}
                                    </span>
                                `,
                            )
                            .join("")}
                    </div>
                `
                : "";
            const skuMarkup = item.sku
                ? `<div style="margin-top:8px; font-size:12px; line-height:18px; color:#7f5579;">SKU: ${escapeHtml(item.sku)}</div>`
                : "";
            const thumbnailMarkup = item.thumbnailUrl
                ? `
                    <img
                        src="${escapeAttribute(item.thumbnailUrl)}"
                        alt="${escapeAttribute(item.name)}"
                        width="72"
                        height="72"
                        style="display:block; width:72px; height:72px; border-radius:20px; border:1px solid rgba(207,12,116,0.14); object-fit:cover;"
                    />
                `
                : `
                    <div style="width:72px; height:72px; border-radius:20px; border:1px solid rgba(207,12,116,0.14); background:linear-gradient(145deg, rgba(255,255,255,0.98), rgba(255,241,247,0.92) 58%, rgba(255,248,235,0.92) 100%); text-align:center; font-size:20px; line-height:72px; font-weight:700; letter-spacing:0.18em; color:#5b0b57;">
                        ${escapeHtml(buildInitials(item.name))}
                    </div>
                `;

            return `
                <tr>
                    <td style="padding:0 0 16px;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate; border-spacing:0; background:linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,240,247,0.92) 74%, rgba(255,248,235,0.92)); border:1px solid rgba(91,11,87,0.12); border-radius:24px;">
                            <tr>
                                <td style="padding:18px;">
                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td width="88" valign="top" style="padding-right:16px;">
                                                ${thumbnailMarkup}
                                            </td>
                                            <td valign="top">
                                                <div style="font-size:11px; line-height:16px; font-weight:700; letter-spacing:0.24em; text-transform:uppercase; color:#cf0c74;">Catalog Essential</div>
                                                <div style="margin-top:8px; font-size:18px; line-height:26px; font-weight:700; color:#5b0b57;">${escapeHtml(item.name)}</div>
                                                <div style="margin-top:8px; font-size:14px; line-height:22px; color:#5b0b57;">
                                                    Qty ${item.quantity} at ${formatCurrency(item.unitPrice)} each
                                                </div>
                                                ${variantMarkup}
                                                ${skuMarkup}
                                            </td>
                                            <td width="110" valign="top" align="right" style="font-size:16px; line-height:24px; font-weight:700; color:#5b0b57;">
                                                ${formatCurrency(item.lineTotal)}
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            `;
        })
        .join("");

    const addressCards = [
        needsShippingAddress && shippingAddress ? renderAddressCard("Shipping address", shippingAddress) : "",
        fulfillment.type === "pickup" && shippingAddress ? renderAddressCard("Pickup location", shippingAddress) : "",
        billingAddress ? renderAddressCard("Billing address", billingAddress) : "",
    ].filter(Boolean);
    const returnPolicyLink = `
        <a href="${escapeAttribute(returnPolicyUrl)}" style="color:#cf0c74; font-weight:700; text-decoration:underline; text-underline-offset:3px;">
            review our return policy
        </a>
    `;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>${escapeHtml(buildOrderConfirmationSubject(orderNumber))}</title>
</head>
<body style="margin:0; padding:0; background-color:#fff9f2; background-image:radial-gradient(circle at top left, rgba(244,182,29,0.16), transparent 24%), radial-gradient(circle at top right, rgba(246,31,141,0.10), transparent 20%), linear-gradient(180deg, #fff9f2 0%, #fff6f3 28%, #fff0f7 72%, #fffaf5 100%); font-family:Arial, Helvetica, sans-serif; color:#3f163c;">
    <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
        ${escapeHtml(previewText)}
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        <tr>
            <td style="padding:24px 12px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate; border-spacing:0; max-width:680px; margin:0 auto; background:linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,241,247,0.95) 72%, rgba(255,248,235,0.94) 100%); border:1px solid rgba(91,11,87,0.12); border-radius:32px; overflow:hidden; box-shadow:0 28px 90px -44px rgba(91,11,87,0.42);">
                    <tr>
                        <td style="padding:32px 28px; border-bottom:1px solid rgba(207,12,116,0.18); background:radial-gradient(circle at 12% 0%, rgba(244,182,29,0.24), transparent 28%), radial-gradient(circle at 90% 12%, rgba(246,31,141,0.14), transparent 22%), linear-gradient(135deg, rgba(255,255,255,0.96), rgba(255,240,247,0.95) 56%, rgba(255,248,235,0.94) 100%);">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td valign="top">
                                        <table role="presentation" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td valign="middle" style="padding-right:14px;">
                                                    ${
                                                        logoUrl
                                                            ? `<img src="${escapeAttribute(logoUrl)}" alt="${escapeAttribute(storeName)}" width="56" height="56" style="display:block; width:56px; height:56px; border-radius:18px;" />`
                                                            : `<div style="width:56px; height:56px; border-radius:18px; background:#ffffff; border:1px solid rgba(207,12,116,0.14); text-align:center; font-size:18px; line-height:56px; font-weight:800; letter-spacing:0.18em; color:#5b0b57;">${escapeHtml(buildInitials(storeName))}</div>`
                                                    }
                                                </td>
                                                <td valign="middle">
                                                    <div style="font-size:11px; line-height:16px; font-weight:700; letter-spacing:0.28em; text-transform:uppercase; color:#cf0c74;">${escapeHtml(storeName)}</div>
                                                    <div style="margin-top:6px; font-size:14px; line-height:22px; color:#7f5579;">${escapeHtml(storeTagline)}</div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td valign="top" align="right">
                                        <span style="display:inline-block; padding:10px 14px; border-radius:999px; background:#fff0f7; border:1px solid rgba(207,12,116,0.14); font-size:12px; line-height:16px; font-weight:700; color:#cf0c74;">
                                            ${escapeHtml(paymentStatus)}
                                        </span>
                                    </td>
                                </tr>
                            </table>

                            <div style="margin-top:26px; font-size:12px; line-height:18px; font-weight:700; letter-spacing:0.28em; text-transform:uppercase; color:#cf0c74;">Order confirmed</div>
                            <h1 style="margin:10px 0 0; font-size:34px; line-height:40px; font-weight:800; color:#5b0b57;">
                                Thanks, your order is confirmed.
                            </h1>
                            <p style="margin:14px 0 0; font-size:16px; line-height:26px; color:#5b0b57;">
                                Hi ${escapeHtml(customerName)}, we&rsquo;ve received your order and we&rsquo;re getting it ready now. Below is your full order summary so you can confirm every detail at a glance.
                            </p>

                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px; border-collapse:separate; border-spacing:0; background:rgba(255,255,255,0.84); border:1px solid rgba(91,11,87,0.12); border-radius:24px;">
                                <tr>
                                    <td style="padding:18px 20px;">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td valign="top" style="padding:0 12px 12px 0;">
                                                    <div style="font-size:12px; line-height:18px; color:#7f5579;">Order number</div>
                                                    <div style="margin-top:4px; font-size:18px; line-height:26px; font-weight:700; color:#5b0b57;">#${escapeHtml(orderNumber)}</div>
                                                </td>
                                                <td valign="top" style="padding:0 12px 12px 0;">
                                                    <div style="font-size:12px; line-height:18px; color:#7f5579;">Order date</div>
                                                    <div style="margin-top:4px; font-size:16px; line-height:24px; font-weight:700; color:#5b0b57;">${escapeHtml(orderedAtLabel)}</div>
                                                </td>
                                                <td valign="top" style="padding:0;">
                                                    <div style="font-size:12px; line-height:18px; color:#7f5579;">Payment</div>
                                                    <div style="margin-top:4px; font-size:16px; line-height:24px; font-weight:700; color:#5b0b57;">${escapeHtml(paymentStatus)}</div>
                                                </td>
                                            </tr>
                                        </table>
                                        ${
                                            paymentNote
                                                ? `<div style="margin-top:8px; font-size:14px; line-height:22px; color:#7f5579;">${escapeHtml(paymentNote)}</div>`
                                                : ""
                                        }
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:28px;">
                            <div style="font-size:12px; line-height:18px; font-weight:700; letter-spacing:0.28em; text-transform:uppercase; color:#cf0c74;">Order summary</div>
                            <h2 style="margin:10px 0 0; font-size:28px; line-height:34px; font-weight:800; color:#5b0b57;">Everything in this order</h2>

                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:18px;">
                                ${itemMarkup}
                            </table>

                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate; border-spacing:0; margin-top:8px; background:linear-gradient(135deg, rgba(255,255,255,0.98), rgba(255,234,244,0.94) 58%, rgba(255,240,191,0.90) 110%); border:1px solid rgba(207,12,116,0.18); border-radius:24px;">
                                <tr>
                                    <td style="padding:20px;">
                                        ${renderSummaryRow("Subtotal", formatCurrency(summary.subtotal))}
                                        ${renderSummaryRow("Shipping", formatCurrency(summary.shipping))}
                                        ${renderSummaryRow("Tax", formatCurrency(summary.tax))}
                                        ${renderSummaryRow("Discounts", summary.discount ? `-${formatCurrency(summary.discount)}` : formatCurrency(0))}
                                        <div style="margin-top:14px; padding-top:14px; border-top:1px solid rgba(91,11,87,0.12);">
                                            ${renderSummaryRow("Total", formatCurrency(summary.total), true)}
                                        </div>
                                    </td>
                                </tr>
                            </table>

                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
                                <tr>
                                    <td valign="top" style="padding:0 8px 0 0;">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate; border-spacing:0; background:rgba(255,255,255,0.86); border:1px solid rgba(91,11,87,0.12); border-radius:24px;">
                                            <tr>
                                                <td style="padding:20px;">
                                                    <div style="font-size:12px; line-height:18px; font-weight:700; letter-spacing:0.28em; text-transform:uppercase; color:#cf0c74;">Fulfillment</div>
                                                    <div style="margin-top:10px; font-size:22px; line-height:28px; font-weight:700; color:#5b0b57;">${escapeHtml(fulfillment.methodLabel)}</div>
                                                    <div style="margin-top:12px; font-size:14px; line-height:22px; color:#7f5579;">Expected timeline</div>
                                                    <div style="margin-top:4px; font-size:16px; line-height:24px; font-weight:700; color:#5b0b57;">${escapeHtml(fulfillment.expectedWindow)}</div>
                                                    ${
                                                        fulfillment.instructions
                                                            ? `<div style="margin-top:14px; font-size:14px; line-height:22px; color:#5b0b57;">${escapeHtml(fulfillment.instructions)}</div>`
                                                            : ""
                                                    }
                                                    ${
                                                        fulfillment.storeHours
                                                            ? `<div style="margin-top:10px; font-size:14px; line-height:22px; color:#7f5579;">Store hours: ${escapeHtml(fulfillment.storeHours)}</div>`
                                                            : ""
                                                    }
                                                    ${
                                                        fulfillment.changeWindowHours
                                                            ? `<div style="margin-top:14px; padding:12px 14px; border-radius:18px; background:#fff0f7; color:#cf0c74; font-size:13px; line-height:20px; font-weight:700;">Need to change something? Contact us within ${fulfillment.changeWindowHours} hours and we&rsquo;ll do our best to update the order before fulfillment begins.</div>`
                                                            : ""
                                                    }
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            ${renderAddressSection(addressCards)}

                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px; border-collapse:separate; border-spacing:0; background:linear-gradient(135deg, rgba(255,255,255,0.98), rgba(255,240,247,0.94) 58%, rgba(255,248,235,0.92) 110%); border:1px solid rgba(207,12,116,0.18); border-radius:24px;">
                                <tr>
                                    <td style="padding:20px;">
                                        <div style="font-size:12px; line-height:18px; font-weight:700; letter-spacing:0.28em; text-transform:uppercase; color:#cf0c74;">What happens next</div>
                                        <div style="margin-top:10px; font-size:16px; line-height:26px; color:#5b0b57;">
                                            We&rsquo;ll send another email as soon as your order is ready${fulfillment.type === "shipping" || fulfillment.type === "local_delivery" ? " to ship" : " for pickup"}. You can use the button below any time to check status.
                                        </div>
                                        ${
                                            actionUrl
                                                ? `
                                                    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:18px;">
                                                        <tr>
                                                            <td style="border-radius:999px; background:#f61f8d;">
                                                                <a href="${escapeAttribute(actionUrl)}" style="display:inline-block; padding:14px 22px; color:#fffdfc; font-size:14px; line-height:20px; font-weight:700; text-decoration:none;">
                                                                    ${escapeHtml(actionLabel)}
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                `
                                                : ""
                                        }
                                    </td>
                                </tr>
                            </table>

                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:18px; border-collapse:separate; border-spacing:0; background:rgba(255,255,255,0.88); border:1px solid rgba(91,11,87,0.12); border-radius:24px;">
                                <tr>
                                    <td style="padding:20px;">
                                        <div style="font-size:12px; line-height:18px; font-weight:700; letter-spacing:0.28em; text-transform:uppercase; color:#cf0c74;">Support and returns</div>
                                        <div style="margin-top:10px; font-size:16px; line-height:26px; color:#5b0b57;">
                                            Questions or something wrong with the order? Contact us at <a href="mailto:${escapeAttribute(supportEmail)}" style="color:#cf0c74; font-weight:700; text-decoration:underline; text-underline-offset:3px;">${escapeHtml(supportEmail)}</a>${supportPhone ? ` or ${escapeHtml(supportPhone)}` : ""}.
                                        </div>
                                        ${
                                            supportHours
                                                ? `<div style="margin-top:8px; font-size:14px; line-height:22px; color:#7f5579;">Support hours: ${escapeHtml(supportHours)}</div>`
                                                : ""
                                        }
                                        <div style="margin-top:10px; font-size:14px; line-height:22px; color:#7f5579;">
                                            For returns, exchanges, and eligibility details, please ${returnPolicyLink}.
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:0 28px 28px;">
                            <div style="padding-top:18px; border-top:1px solid rgba(91,11,87,0.12); font-size:12px; line-height:20px; color:#7f5579;">
                                <div>${escapeHtml(storeName)}</div>
                                <div style="margin-top:4px;">${escapeHtml(contactLine)}</div>
                                ${
                                    storeUrl
                                        ? `<div style="margin-top:4px;"><a href="${escapeAttribute(storeUrl)}" style="color:#cf0c74; text-decoration:underline; text-underline-offset:3px;">${escapeHtml(storeUrl)}</a></div>`
                                        : ""
                                }
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();
}

function renderSummaryRow(label: string, value: string, emphasize = false) {
    const fontSize = emphasize ? "18px" : "14px";
    const lineHeight = emphasize ? "26px" : "22px";
    const fontWeight = emphasize ? "800" : "600";

    return `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            <tr>
                <td style="padding:0 0 8px; font-size:${fontSize}; line-height:${lineHeight}; color:#5b0b57; ${emphasize ? "font-weight:800;" : ""}">
                    ${escapeHtml(label)}
                </td>
                <td align="right" style="padding:0 0 8px; font-size:${fontSize}; line-height:${lineHeight}; font-weight:${fontWeight}; color:#5b0b57;">
                    ${escapeHtml(value)}
                </td>
            </tr>
        </table>
    `;
}

function renderAddressCard(title: string, address: OrderEmailAddress) {
    return `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate; border-spacing:0; background:rgba(255,255,255,0.86); border:1px solid rgba(91,11,87,0.12); border-radius:24px;">
            <tr>
                <td style="padding:20px;">
                    <div style="font-size:12px; line-height:18px; font-weight:700; letter-spacing:0.28em; text-transform:uppercase; color:#cf0c74;">${escapeHtml(title)}</div>
                    <div style="margin-top:10px; font-size:14px; line-height:24px; color:#5b0b57;">
                        ${renderAddressLines(address)}
                    </div>
                </td>
            </tr>
        </table>
    `;
}

function renderAddressSection(cards: string[]) {
    if (!cards.length) {
        return "";
    }

    if (cards.length === 1) {
        return `
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:18px;">
                <tr>
                    <td valign="top">
                        ${cards[0]}
                    </td>
                </tr>
            </table>
        `;
    }

    return `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:18px;">
            <tr>
                <td valign="top" style="padding:0 8px 0 0;">
                    ${cards[0]}
                </td>
                <td valign="top" style="padding:0 0 0 8px;">
                    ${cards[1]}
                </td>
            </tr>
        </table>
        ${cards[2] ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;"><tr><td valign="top">${cards[2]}</td></tr></table>` : ""}
    `;
}

function renderAddressLines(address: OrderEmailAddress) {
    const lines = [
        address.name,
        address.line1,
        address.line2,
        [address.city, address.state].filter(Boolean).join(", "),
        [address.postalCode, address.country].filter(Boolean).join(" "),
    ].filter(Boolean);

    return lines.map((line) => `${escapeHtml(line as string)}<br />`).join("");
}

function formatOrderDate(value: string | Date) {
    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return new Intl.DateTimeFormat("en-US", {
        dateStyle: "long",
        timeStyle: "short",
    }).format(date);
}

function buildInitials(value: string) {
    return value
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0]?.toUpperCase() ?? "")
        .join("") || "TBS";
}

function escapeHtml(value: string) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function escapeAttribute(value: string) {
    return escapeHtml(value);
}
