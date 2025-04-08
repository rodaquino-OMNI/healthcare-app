import React from 'react';
import {
  Button as OriginalButton,
  Card as OriginalCard,
  DescriptionList as OriginalDescriptionList,
  Input as OriginalInput,
  Select as OriginalSelect,
  Form as OriginalForm,
  List as OriginalList,
  PatientBanner as OriginalPatientBanner,
  AllergyDetail as OriginalAllergyDetail,
  AllergyCard as OriginalAllergyCard,
  FlagDetail as OriginalFlagDetail,
  Table as OriginalTable
} from '../../utils/ltht-component-wrappers';

// Re-export all components
export const Button = OriginalButton;
export const Card = OriginalCard;
export const DescriptionList = OriginalDescriptionList;
export const Input = OriginalInput;
export const Select = OriginalSelect;
export const Form = OriginalForm;
export const List = OriginalList;
export const PatientBanner = OriginalPatientBanner;
export const AllergyDetail = OriginalAllergyDetail;
export const AllergyCard = OriginalAllergyCard;
export const FlagDetail = OriginalFlagDetail;
export const Table = OriginalTable;

// Default export with all components
export default {
  Button,
  Card,
  DescriptionList,
  Input,
  Select,
  Form,
  List,
  PatientBanner,
  AllergyDetail,
  AllergyCard,
  FlagDetail,
  Table
};