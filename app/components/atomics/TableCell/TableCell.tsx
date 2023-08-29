import { ReactNode, memo } from 'react';
import { mapStyles } from '@/util/mapStyles';
import styles from './TableCell.module.css';

function TableCellComponent({
  children,
  grow,
}: {
  children?: ReactNode;
  grow?: boolean;
}) {
  const className = mapStyles(styles, { grow });
  return <td className={className}>{children}</td>;
}

export const TableCell = memo(TableCellComponent);
