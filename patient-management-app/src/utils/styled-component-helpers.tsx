// Styled component helpers
// This file provides helper functions for working with styled components

import React from 'react';
import styled from '@emotion/styled';
import { StyledComponentProps } from '../types/styled-components';

// Helper function to create a styled component with proper typing
export function createStyledComponent<P = {}>(
  Component: React.ComponentType<P>,
  styles: any
): React.FC<P & StyledComponentProps> {
  return styled(Component)(styles) as React.FC<P & StyledComponentProps>;
}

// Helper function to create a styled HTML element with proper typing
export function createStyledElement<E extends keyof JSX.IntrinsicElements>(
  element: E,
  styles: any
): React.FC<JSX.IntrinsicElements[E] & StyledComponentProps> {
  return styled(element)(styles) as React.FC<JSX.IntrinsicElements[E] & StyledComponentProps>;
}

// Helper function to create a styled component with a status prop
export function createStyledStatusComponent<P = {}>(
  Component: React.ComponentType<P>,
  styles: any
): React.FC<P & StyledComponentProps & { status: string }> {
  return styled(Component)(styles) as React.FC<P & StyledComponentProps & { status: string }>;
}

// Helper function to create a styled element with a status prop
export function createStyledStatusElement<E extends keyof JSX.IntrinsicElements>(
  element: E,
  styles: any
): React.FC<JSX.IntrinsicElements[E] & StyledComponentProps & { status: string }> {
  return styled(element)(styles) as React.FC<JSX.IntrinsicElements[E] & StyledComponentProps & { status: string }>;
}

// Helper function to create a styled component with a selected prop
export function createStyledSelectableComponent<P = {}>(
  Component: React.ComponentType<P>,
  styles: any
): React.FC<P & StyledComponentProps & { selected: boolean }> {
  return styled(Component)(styles) as React.FC<P & StyledComponentProps & { selected: boolean }>;
}

// Helper function to create a styled element with a selected prop
export function createStyledSelectableElement<E extends keyof JSX.IntrinsicElements>(
  element: E,
  styles: any
): React.FC<JSX.IntrinsicElements[E] & StyledComponentProps & { selected: boolean }> {
  return styled(element)(styles) as React.FC<JSX.IntrinsicElements[E] & StyledComponentProps & { selected: boolean }>;
}

// Pre-defined styled components for common elements
export const PageContainer = createStyledElement('div', {});
export const PageHeader = createStyledElement('div', {});
export const PageTitle = createStyledElement('h2', {});
export const ButtonContainer = createStyledElement('div', {});
export const ContentGrid = createStyledElement('div', {});
export const DashboardContainer = createStyledElement('div', {});
export const StyledForm = createStyledElement('form', {});
export const FormSection = createStyledElement('div', {});
export const FormRow = createStyledElement('div', {});
export const SectionTitle = createStyledElement('h2', {});
export const ErrorText = createStyledElement('div', {});
export const SearchContainer = createStyledElement('div', {});
export const SearchInput = createStyledElement('input', {});
export const SearchButton = createStyledElement('button', {});
export const FilterContainer = createStyledElement('div', {});
export const FilterSelect = createStyledElement('select', {});
export const InstructionsTextarea = createStyledElement('textarea', {});
export const NotesTextarea = createStyledElement('textarea', {});
export const MedicationItem = createStyledElement('div', {});
export const MedicationInfo = createStyledElement('div', {});
export const MedicationName = createStyledElement('div', {});
export const MedicationDetails = createStyledElement('div', {});
export const AppointmentItem = createStyledElement('div', {});
export const DateTimeContainer = createStyledElement('div', {});
export const DateText = createStyledElement('div', {});
export const TimeText = createStyledElement('div', {});
export const AppointmentInfo = createStyledElement('div', {});
export const AppointmentTitle = createStyledElement('div', {});
export const AppointmentDetails = createStyledElement('div', {});
export const TimeSlotContainer = createStyledElement('div', {});
export const TimeSlot = createStyledSelectableElement('button', {});
export const SectionHeader = createStyledElement('h3', {});
export const SectionHeading = createStyledElement('h3', {});
export const NotesContainer = createStyledElement('div', {});
export const StatusBadge = createStyledStatusElement('span', {});
export const ActionButtons = createStyledElement('div', {});
export const StatCard = createStyledElement('div', {});
export const StatValue = createStyledElement('div', {});
export const StatLabel = createStyledElement('div', {});
