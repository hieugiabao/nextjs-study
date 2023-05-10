import Link from "next/link";
import styled from "styled-components";
import { StyledButtonProps, ButtonStyle } from "./Button";

interface ButtonLinkProps extends StyledButtonProps {
  href: string;
}

const StyledLink = styled(Link)<ButtonLinkProps>`
  ${ButtonStyle}
`;

export default function ButtonLink(props: ButtonLinkProps) {
  return <StyledLink {...props}></StyledLink>;
}
