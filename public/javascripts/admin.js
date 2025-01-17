function initAdmin() {
  const orderTableBody = document.querySelector('#orderTableBody');
  let orders = [];
  let markup;
  axios
    .get('/adminOrders', {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    })
    .then(res => {
      orders = res.data;
      markup = generateMarkup(orders);
      orderTableBody.innerHTML = markup;
    })
    .catch(err => {
      console.error('Error fetching orders:', err);
    });

  // Function to render items
  function renderItems(items) {
    let parsedItems = Object.values(items);
    return parsedItems
      .map(menuItem => {
        return `
          <p>${menuItem.item.name} - ${menuItem.qty} pcs </p>
        `;
      })
      .join('');
  }

  // Function to generate the table markup
  function generateMarkup(orders) {
    return orders
      .map(order => {
        return `
          <tr>
            <td style="padding: 8px; color:red;cursor:pointer; border: 1px solid black;">${
              order._id
            }</td>
            <td style="padding: 8px;border: 1px solid black;">${renderItems(
              order.items
            )}</td>
            <td style="padding: 8px; border: 1px solid black;">${
              order.address
            }</td>
            <td style="padding: 8px; border: 1px solid black;">
              <form action="/status" method="POST">
                <input type="hidden" name="orderId" value="${order._id}">
                <select name="status" onchange="this.form.submit()">
                  <option value="order_placed" ${
                    order.status === 'order_placed' ? 'selected' : ''
                  }>Placed</option>
                  <option value="confirmed" ${
                    order.status === 'confirmed' ? 'selected' : ''
                  }>Confirmed</option>
                  <option value="prepared" ${
                    order.status === 'prepared' ? 'selected' : ''
                  }>Prepared</option>
                  <option value="Out for delivery" ${
                    order.status === 'Out for delivery' ? 'selected' : ''
                  }>Out for delivery</option>
                  <option value="Delivered" ${
                    order.status === 'Delivered' ? 'selected' : ''
                  }>Delivered</option>
                  <option value="completed" ${
                    order.status === 'completed' ? 'selected' : ''
                  }>Completed</option>
                </select>
              </form>
            </td>
            <td style="padding: 8px; border: 1px solid black;">${
              order.createdAt
            }</td>
            <td style="padding: 8px;  border: 1px solid black;">${
              order.paymentStatus ? 'Paid' : 'Not Paid'
            }</td>
          </tr>
        `;
      })
      .join('');
  }
}

initAdmin();
