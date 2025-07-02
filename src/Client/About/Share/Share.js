import { useState } from "react";
import React from "react";
import "./Share.css";

const Share = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const values = [
    {
      title: "Leadership",
      content:
        "We dream big and strive toward making the seemingly impossible possible, lifting the sector as we go.",
    },
    {
      title: "Collaboration",
      content:
        "We collaborate internally and externally to accelerate our work and achieve more together.",
    },
    {
      title: "Equity",
      content:
        "We stand for equity, diversity, and inclusion within our organization and through our evaluations and guidance.",
    },
    {
      title: "Usefulness",
      content:
        "We provide fair, transparent evaluations, and valuable tools to enable a diverse set of donors to find and support an ever-greater number of nonprofits they can trust.",
    },
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  return (
    <div>
      <div className="our-container">
        <div className="our-cmp">
          <div className="our-aem">
            <div className="our-text">
              <div className="our-data">
                <h2 className="our-about">Our Values</h2>
                <p></p>
                <p>
                  <span className="our-para">
                    These are the beliefs and principles that guide Charity
                    Navigator and our team.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="accordion">
        {values.map((value, index) => (
          <div className="accordion-item" key={index}>
            <div
              className="accordion-title"
              onClick={() => toggleAccordion(index)}
            >
              <h3>{value.title}</h3>
              <span>{activeIndex === index ? "–" : "+"}</span>
            </div>
            {activeIndex === index && (
              <div className="accordion-content">
                <p>{value.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Share;

// import React, { useState } from "react";
// import "./ValuesAccordion.css";

// const ValuesAccordion = () => {
//   const [activeIndex, setActiveIndex] = useState(null);

//   const values = [
//     {
//       title: "Khả năng lãnh đạo",
//       content:
//         "Chúng tôi có những ước mơ lớn và nỗ lực biến điều không thể thành có thể, đồng thời thúc đẩy ngành này phát triển.",
//     },
//     { title: "Sự hợp tác", content: "Chúng tôi đề cao tinh thần hợp tác và đoàn kết trong mọi hoạt động." },
//     { title: "Công bằng", content: "Chúng tôi đảm bảo sự công bằng và minh bạch trong mọi quyết định." },
//     { title: "Tính hữu ích", content: "Chúng tôi luôn hướng tới giá trị mang lại lợi ích thiết thực nhất cho cộng đồng." },
//   ];

//   const toggleAccordion = (index) => {
//     setActiveIndex(activeIndex === index ? null : index);
//   };

//   return (
//     <div className="values-section">
//       <h2>Giá trị của chúng tôi</h2>
//       <p>
//         Đây là những niềm tin và nguyên tắc hướng dẫn Charity Navigator và nhóm của chúng tôi.
//       </p>
//       <div className="accordion">
//         {values.map((value, index) => (
//           <div className="accordion-item" key={index}>
//             <div
//               className="accordion-title"
//               onClick={() => toggleAccordion(index)}
//             >
//               <h3>{value.title}</h3>
//               <span>{activeIndex === index ? "–" : "+"}</span>
//             </div>
//             {activeIndex === index && (
//               <div className="accordion-content">
//                 <p>{value.content}</p>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ValuesAccordion;
