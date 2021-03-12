import React from "react";
import { Menu } from "antd";
import { HomeOutlined, SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const mainMenu = [
  {
    url: "/home",
    label: "Home",
    icon: HomeOutlined,
    private: true,
  },
  {
    url: "/",
    label: "Explore",
    icon: SearchOutlined,
    private: false,
  },
];

const SideMenu: React.FC<any> = ({ web3Agent }) => {
  return (
    <div
      style={{
        height: "100%",
        position: "fixed",
        width: 200,
        top: 0,
      }}
    >
      <div
        className="logo"
        style={{ paddingLeft: 14, paddingTop: 15, fontSize: 35 }}
      >
        👩🏽‍🎤
        {/* <img alt="logo" src={logo} style={{ height: 30 }} /> */}
      </div>
      <Menu className="main-menu" mode="inline" defaultSelectedKeys={["4"]}>
        {mainMenu.map((menuItem) => {
          return (
            (web3Agent || !menuItem.private) && (
              <Menu.Item
                key={menuItem.label}
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  marginBottom: 20,
                  height: 50,
                }}
                icon={
                  <menuItem.icon style={{ fontSize: 30, marginRight: 20 }} />
                }
              >
                <Link to={menuItem.url}>{menuItem.label}</Link>
              </Menu.Item>
            )
          );
        })}
      </Menu>
    </div>
  );
};

export default SideMenu;
