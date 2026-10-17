const e=`<p class="goal">Grouping data in C: structs, typedefs, opaque types, enums and unions, and how they're laid out in memory.</p>
<h3>Structs</h3>
<pre data-lang="c"><code class="language-c">typedef struct {
    char sku[16];
    int qty;
    long price_paise;
} Item;

Item milk = { .sku = "milk", .qty = 2, .price_paise = 6000 };   /* designated initialisers (unlisted fields = 0) */
Item copy = milk;                  /* assignment copies the whole struct (value semantics) */
Item *p = &amp;milk;
p-&gt;qty += 1;                       /* p-&gt;qty is shorthand for (*p).qty */
long item_total(const Item *it) { return it-&gt;qty * it-&gt;price_paise; }   /* pass by pointer; const = read-only */

typedef struct Node {              /* self-referential structs need the tag name */
    Item item;
    struct Node *next;
} Node;</code></pre>
<p>Layout: fields sit in order, with padding added for alignment. Order fields from largest to smallest to save space (<a class="xref" data-old="n03">Memory &amp; Data Representation</a>); check with <code>sizeof</code> and <code>offsetof</code>.</p>
<h3>Enums</h3>
<pre data-lang="c"><code class="language-c">typedef enum { STATUS_PLACED, STATUS_PAID, STATUS_SHIPPED, STATUS_COUNT } Status;
static const char *STATUS_NAMES[STATUS_COUNT] = { "placed", "paid", "shipped" };
/* enums are just ints: nothing stops (Status)42. Validate values from outside */</code></pre>
<h3>Unions and tagged unions</h3>
<pre data-lang="c"><code class="language-c">typedef enum { PAY_UPI, PAY_CARD, PAY_CASH } PayKind;
typedef struct {
    PayKind kind;                        /* the TAG says which union member is valid */
    union {
        struct { char vpa[64]; } upi;
        struct { char last4[5]; int network; } card;
    } as;
} Payment;

void print_payment(const Payment *p) {
    switch (p-&gt;kind) {
    case PAY_UPI:  printf("UPI %s\\n", p-&gt;as.upi.vpa); break;
    case PAY_CARD: printf("card ••%s\\n", p-&gt;as.card.last4); break;
    case PAY_CASH: puts("cash"); break;
    }
}</code></pre>
<p>That's C's version of Rust enums or TS discriminated unions, except nothing enforces that the tag and the data match: that's up to you.</p>
<h3>Opaque types: encapsulation in C</h3>
<p>Declare <code>typedef struct Cart Cart;</code> in the header and define the struct only in the <code>.c</code> file. Users can hold a <code>Cart *</code> and call your functions, but can't touch the fields (<a class="xref" data-old="x-c-functions">Functions &amp; Headers</a>).</p>
<h3>Bit fields</h3>
<pre data-lang="c"><code class="language-c">struct Flags { unsigned paid : 1; unsigned express : 1; unsigned priority : 3; };   /* packed into bits */</code></pre>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>0.1 <span class="levels">basic</span> Implement the tagged-union Payment with a constructor for each kind, <code>print_payment</code>, and <code>fee_paise(const Payment *, long amount)</code>. Compile with <code>-Wswitch-enum</code>, add a new kind, and see the warnings.</summary><div><p>Constructors like <code>Payment pay_upi(const char *vpa)</code> set the kind plus the <code>snprintf</code>-copied field. <code>-Wswitch-enum</code> warns about any switch that doesn&#39;t list every enum value, which is the closest C gets to exhaustive matching.</p></div></details>
</div>
`;export{e as default};
