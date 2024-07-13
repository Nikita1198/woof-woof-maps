import { memo } from "react";

const Logo = memo(() => (
  <img
    src="../aphrodita_logo.png"
    width={170}
    height={170}
    alt="Logo"
    loading="lazy"
    style={{ display: "block", margin: "0 auto" }}
  />
));

export default Logo;
