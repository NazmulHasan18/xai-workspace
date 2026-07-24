# AGENT.md

# XAI – Intelligence Workspace

This document defines the engineering, design, and implementation rules for this repository.

The objective is to build a premium interactive AI product experience, not a landing page.

Every implementation decision should reinforce the narrative:

Raw Data
↓

Structured Intelligence
↓

Actionable Insights

The experience should feel:

- Calm
- Premium
- Technical
- Minimal
- Intelligent

Never make the UI feel playful or over-animated.

---

# Primary Goal

Build a single-page interactive product experience demonstrating:

- Modern UI engineering
- Strong motion design
- 3D interaction
- Product thinking
- Clean architecture
- Performance

Every animation must have a purpose.

Do not animate simply because animation is possible.

---

# Technology Stack

Framework

- Next.js (App Router)
- React 19
- TypeScript

Styling

- Tailwind CSS
- CSS Variables
- Responsive utilities

Animation

- Framer Motion
- GSAP
- ScrollTrigger

3D

- React Three Fiber
- Drei
- Three.js

Icons

- Lucide React

---

# Motion Philosophy

Motion communicates product intelligence.

Never use random animations.

Everything should explain the product.

Bad

Card bounces.

Button spins.

Logo rotates forever.

Good

Particles organize into a network.

Camera slowly reveals structure.

Dashboard emerges from data.

Every movement should have intent.

---

# Animation Responsibilities

Use Framer Motion for:

- text
- cards
- buttons
- section transitions
- hover states
- page choreography

Use GSAP for:

- ScrollTrigger
- timelines
- pinning
- sequencing
- scrub animations

Use React Three Fiber for:

- particles
- geometry
- camera
- lighting
- depth
- morphing
- AI core

Never replace GSAP with Framer Motion when scroll orchestration is required.

---

# UI Style

Inspired by

- Stripe
- Linear
- Vercel

DO NOT COPY.

Use them only for design language.

Characteristics

- generous whitespace
- soft borders
- subtle shadows
- restrained colors
- premium typography

Avoid

Huge gradients

Glass everywhere

Neon overload

Heavy blur

Marketing clichés

---

# Color Palette

Background

#060B14

Surface

#101827

Border

#1E293B

Primary

#4F8BFF

Secondary

#6EE7FF

Success

#4ADE80

Text

#F8FAFC

Muted

#94A3B8

---

# Layout Rules

Desktop-first

Maximum content width

1280px

Section spacing

120px

Grid

12 columns

Spacing system

4
8
16
24
32
48
64
96

Never use arbitrary spacing values.

---

# Components

Every UI element should be reusable.

Examples

Button

Card

Badge

Navbar

Sidebar

Dashboard Card

Metric Card

Chart Card

Section Title

Container

Avoid duplicated JSX.

---

# Folder Structure

src/

app/

components/

layout/

sections/

hero/

flow/

dashboard/

wow/

three/

ui/

hooks/

lib/

styles/

types/

data/

Animations should live beside the component that owns them.

---

# Hero

Contains

Headline

Description

CTA

3D Scene

Particles

Lighting

Camera

The hero must immediately communicate:

Raw Data → Intelligence

---

# Interactive Flow

Three stages

1. Ingest

2. Analyze

3. Insight

Every stage should animate into the next.

No disconnected cards.

---

# Dashboard

Must feel like a real product.

Include

Sidebar

Metrics

Charts

Tables

Recent Activity

AI Summary

Use realistic mock data.

---

# WOW Interaction

This is the most important section.

Goal

Create one memorable interaction.

Possible implementation

Floating particle cloud

↓

Scroll

↓

Particles move together

↓

Neural network forms

↓

AI Core appears

↓

Dashboard materializes

This interaction should demonstrate

3D

Math

Timing

Depth

Scroll synchronization

Camera movement

Avoid gimmicks.

---

# Performance

Target

60 FPS

Lazy load heavy sections.

Memoize expensive calculations.

Avoid unnecessary re-renders.

Dispose Three.js resources.

Optimize particle counts.

Prefer instancing when rendering many objects.

---

# Accessibility

All buttons

aria-label

Keyboard accessible

Proper heading hierarchy

Visible focus states

Respect prefers-reduced-motion where possible

---

# Code Quality

No any

Strict TypeScript

Small components

Meaningful names

No magic numbers

Extract constants

Document complex animation logic.

---

# AI Agent Rules

Before writing code:

Understand the purpose of the section.

Do not introduce libraries unless necessary.

Do not generate placeholder animations.

Do not generate generic marketing layouts.

Prefer clean architecture over clever code.

If adding animation:

Explain why it exists.

If adding 3D:

Explain why it improves the story.

If uncertain:

Choose the simpler solution.

---

# Definition of Done

A feature is complete only if:

✓ Clean architecture

✓ Responsive

✓ Accessible

✓ Performs well

✓ Matches design language

✓ Motion has intent

✓ Uses reusable components

✓ No duplicated code

✓ Passes lint

✓ Passes type check

✓ Looks like a premium AI product

Not like a startup landing page.

The final experience should make reviewers think:

"This developer understands frontend engineering, interaction design, and product craftsmanship."
