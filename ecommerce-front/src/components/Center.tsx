import styled from "styled-components";

const StyledDiv = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
`;

interface Props {
  children: React.ReactNode;
}

export default function Center({ children }: Props) {
  return <StyledDiv>{children}</StyledDiv>;
}
