import { TemplateRef } from '@angular/core';

export interface UIInfo {
  title: string;
  goBackPath?: string;
  refreshPath?: string;
  addNewPath?: string;
  viewNewPath?: string;
  formId?: string;
  editPath?: string;
  goFullScreen?: boolean;
  additionalComponent?: TemplateRef<any>;
  isTitleBarHidden?:boolean;
  isProfile?:boolean;
  refresh?: () => void;
  addNew?: () => void;
  goBack?: () => void;
  goNext?: () => void;
  qrcode?: () => void;
  submitAll?: () => void;
  draft?: () => void;
}