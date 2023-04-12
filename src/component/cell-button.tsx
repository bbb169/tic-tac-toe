import React from "react";
import { Button } from "antd";
import { MinusCircleOutlined, CloseOutlined } from "@ant-design/icons";

export function CellButton({
  state,
  style,
  onCellClick,
}: {
  state?: boolean;
  style: React.CSSProperties;
  onCellClick: () => void;
}) {
  return (
    <Button
      icon={
        state === undefined ? (
          ""
        ) : state === true ? (
          <MinusCircleOutlined />
        ) : (
          <CloseOutlined />
        )
      }
      danger={state as boolean}
      type={state === false ? "primary" : "default"}
      style={style}
      onClick={onCellClick}
     />
  );
}
