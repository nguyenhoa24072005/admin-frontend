import React from "react";
import "./ProductList.css";

const ProductList = ({ title, products }) => {
  return (
    <section className="product-list">
      <h2>{title}</h2>
      <div className="product-grid">
        {products.map((product, index) => (
          <div key={index} className="product-card">
            <img
              src={product.image}
              alt={product.name}
              className="product-image"
            />
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">${product.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductList;
