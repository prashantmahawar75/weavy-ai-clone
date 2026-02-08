import { Node } from "@xyflow/react";

export interface HeroNodeData extends Record<string, unknown> {
  type?: string;
  label?: string;
  image?: string;
  video?: string;
  text?: string;
  width?: string;
  height?: string;
  gradientClass?: string;
}

export type HeroNode = Node<HeroNodeData>;
