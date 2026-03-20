import { Router } from "express";
import type { TruckApi } from "../types";

const router = Router();

const MOCK_TRUCKS: TruckApi[] = [
  {
    volume1: 0.0,
    volume2: 0.0,
    name: "TestTruck1",
    description: "TestTruck1",
    carrierCompany: "REEINVENT",
    length1: 0,
    width1: 0,
    height1: 0,
    weight1: 0,
    length2: 0,
    width2: 0,
    height2: 0,
    weight2: 0,
    extHeight: 0,
    totalLength: 0,
    timeAdjustment: 120,
    other: "TestTruck1",
    dataAreaID: "086_GR",
    companyID: "086",
    active: true,
  },
  {
    volume1: 0.0,
    volume2: 0.0,
    name: "TestTruck2",
    description: "TestTruck2",
    carrierCompany: "REEINVENT",
    length1: 0,
    width1: 0,
    height1: 0,
    weight1: 0,
    length2: 0,
    width2: 0,
    height2: 0,
    weight2: 0,
    extHeight: 0,
    totalLength: 0,
    timeAdjustment: 100,
    other: "",
    dataAreaID: "086_GR",
    companyID: "086",
    active: true,
  },
];

/** GET /api/trucks — list of trucks in new format */
router.get("/trucks", (_req, res) => {
  res.json(MOCK_TRUCKS);
});

export default router;
