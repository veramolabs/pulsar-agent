import React from "react";
import { Layout, Menu, Avatar, Typography, Row, Button } from "antd";
import {
  EyeOutlined,
  UserOutlined,
  SearchOutlined,
  SafetyOutlined,
  MessageOutlined,
  DeploymentUnitOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  CloudServerOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useVeramo } from "@veramo-community/veramo-react";
import md5 from "md5";
import logo from "../static/img/logo.svg";

const { Sider } = Layout;
const { SubMenu } = Menu;
const { Title, Text } = Typography;

const mainMenu = [
  {
    url: "/",
    label: "# Explore",
    icon: EyeOutlined,
  },
  //   {
  //     url: "/identifiers",
  //     label: "Identifiers",
  //     icon: UserOutlined,
  //   },
  //   {
  //     url: "/credentials",
  //     label: "Credentials",
  //     icon: SafetyOutlined,
  //   },
  //   {
  //     url: "/messages",
  //     label: "Messages",
  //     icon: MessageOutlined,
  //   },
  //   {
  //     url: "/network",
  //     label: "Network",
  //     icon: DeploymentUnitOutlined,
  //   },
  //   {
  //     url: "/discover",
  //     label: "Discover",
  //     icon: SearchOutlined,
  //   },
];

const SideMenu = () => {
  return (
    <div
      style={{
        height: "100%",
        position: "fixed",
        width: 200,
        top: 0,
      }}
    >
      <div className="logo" style={{ padding: 15 }}>
        <img src={logo} style={{ height: 30 }} />
      </div>
      <Menu className="main-menu" mode="inline" defaultSelectedKeys={["4"]}>
        <div style={{ paddingLeft: 15, marginTop: 30 }}>
          {mainMenu.map((menuItem) => {
            return (
              <Menu.Item
                key={menuItem.label}
                style={{ fontSize: 20, fontWeight: 600 }}
              >
                <Link to={menuItem.url}>{menuItem.label}</Link>
              </Menu.Item>
            );
          })}
        </div>
      </Menu>
    </div>
  );
};

export default SideMenu;
