import React from "react";
import "./Databox.css";

interface DataBoxProps {
  header: string;
  data: {
    label: string;
    value: string | number;
  }[];
  footerText: string;
  footerLink: string;
}

const DataBox: React.FC<DataBoxProps> = ({ header, data, footerText, footerLink }) => {
  return (
    <div className="databox">
      <div className="databox-header">{header}</div>
      <div className="databox-content">
        {data.map((item, index) => (
          <div className="databox-item" key={index}>
            <span>{item.label}</span>
            <div className="databox-item-value">{item.value}</div>
          </div>
        ))}
      </div>
      <div className="databox-footer">
        <a href={footerLink}>{footerText} →</a>
      </div>
    </div>
  );
};

export default DataBox;