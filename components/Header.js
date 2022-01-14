import { Menu } from "semantic-ui-react";
import { Link } from "../routes";

const Header = () => {
  return (
    <Menu style={{ marginTop: "10px" }}>
      <Menu.Item href='' route='/'>
        {/* <img style={{ width: "50px" }} src='images/crowdcoinlogoblack.png' alt='logo' /> */}
        <h3>CrowdCoin</h3>
      </Menu.Item>

      <Menu.Menu position='right'>
        <Link href='' route='/'>
          <a className='item'>Campaigns</a>
        </Link>

        <Link href='' route='/campaigns/new'>
          <a className='item'>+</a>
        </Link>
      </Menu.Menu>
    </Menu>
  );
};

export default Header;
