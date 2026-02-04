"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  X,
  ArrowRightLeft,
  Music,
  Calendar,
  AlertTriangle,
  Info,
  CheckCircle,
  Search,
  Users,
} from "lucide-react";

interface TransferMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransfer?: (data: TransferData) => void;
  memberData?: {
    id: string;
    name: string;
    currentBand?: string;
    age?: number;
    gender?: "Male" | "Female";
  };
}

interface TransferData {
  fromBand: string;
  toBand: string;
  transferDate: string;
  reason: string;
  notes?: string;
  effectiveImmediately: boolean;
}

interface Band {
  id: string;
  name: string;
  description: string;
  ageRange: string;
  genderRestriction: "Male" | "Female" | "Mixed";
  currentMembers: number;
  color: string;
}

export default function TransferMemberModal({
  isOpen,
  onClose,
  onTransfer,
  memberData = {
    id: "BCM1004",
    name: "James Wilson",
    currentBand: "Youth Band",
    age: 27,
    gender: "Male",
  },
}: TransferMemberModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBand, setSelectedBand] = useState<Band | null>(null);
  const [transferDate, setTransferDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [effectiveImmediately, setEffectiveImmediately] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Available bands with their details
  const availableBands: Band[] = [
    {
      id: "children",
      name: "Children's Band",
      description: "For young members",
      ageRange: "6-12 years",
      genderRestriction: "Mixed",
      currentMembers: 145,
      color: "bg-yellow-500",
    },
    {
      id: "pre-youth",
      name: "Pre-Youth Band",
      description: "Transition band for early teens",
      ageRange: "13-15 years",
      genderRestriction: "Mixed",
      currentMembers: 89,
      color: "bg-orange-500",
    },
    {
      id: "youth",
      name: "Youth Band",
      description: "For young adults",
      ageRange: "16-30 years",
      genderRestriction: "Mixed",
      currentMembers: 234,
      color: "bg-blue-500",
    },
    {
      id: "men",
      name: "Men's Band",
      description: "Adult male members",
      ageRange: "31+ years",
      genderRestriction: "Male",
      currentMembers: 167,
      color: "bg-indigo-600",
    },
    {
      id: "women",
      name: "Women's Band",
      description: "Adult female members",
      ageRange: "31+ years",
      genderRestriction: "Female",
      currentMembers: 189,
      color: "bg-pink-500",
    },
    {
      id: "senior",
      name: "Senior Band",
      description: "Senior members",
      ageRange: "60+ years",
      genderRestriction: "Mixed",
      currentMembers: 78,
      color: "bg-purple-600",
    },
  ];

  // Filter out current band and filter by search and gender
  const filteredBands = availableBands.filter((band) => {
    const notCurrentBand = band.name !== memberData.currentBand;
    const matchesSearch =
      band.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      band.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGender =
      band.genderRestriction === "Mixed" ||
      band.genderRestriction === memberData.gender;

    return notCurrentBand && matchesSearch && matchesGender;
  });

  if (!isOpen) return null;

  const handleTransferSubmit = () => {
    if (!selectedBand || !transferDate || !reason) {
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirmTransfer = () => {
    const transferData: TransferData = {
      fromBand: memberData.currentBand || "",
      toBand: selectedBand!.name,
      transferDate,
      reason,
      notes,
      effectiveImmediately,
    };

    onTransfer?.(transferData);
    handleClose();
  };

  const handleClose = () => {
    setSearchQuery("");
    setSelectedBand(null);
    setTransferDate(new Date().toISOString().split("T")[0]);
    setReason("");
    setNotes("");
    setEffectiveImmediately(true);
    setShowConfirmation(false);
    onClose();
  };

  if (showConfirmation) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-lg border-[#EDF1F7] shadow-2xl">
          <CardContent className="p-6">
            {/* Confirmation Header */}
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <ArrowRightLeft className="w-8 h-8 text-[#009AF4]" />
              </div>
            </div>

            <h3 className="text-xl font-semibold text-[#222B45] text-center mb-2">
              Confirm Band Transfer
            </h3>
            <p className="text-sm text-[#8F9BB3] text-center mb-6">
              Please review the transfer details before confirming. This will
              move the member to a different band.
            </p>

            {/* Transfer Summary */}
            <div className="bg-[#F7F9FC] border border-[#EDF1F7] rounded-lg p-4 space-y-3 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#8F9BB3]">Member:</span>
                <span className="font-medium text-[#222B45]">
                  {memberData.name}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#8F9BB3]">Member ID:</span>
                <span className="font-medium text-[#222B45]">
                  {memberData.id}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#8F9BB3]">Age:</span>
                <span className="font-medium text-[#222B45]">
                  {memberData.age} years
                </span>
              </div>
              <div className="h-px bg-[#EDF1F7] my-2"></div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#8F9BB3]">From Band:</span>
                <Badge
                  variant="outline"
                  className="bg-red-50 text-red-700 border-red-200"
                >
                  {memberData.currentBand}
                </Badge>
              </div>
              <div className="flex items-center justify-center">
                <ArrowRightLeft className="w-5 h-5 text-[#009AF4]" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#8F9BB3]">To Band:</span>
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  {selectedBand?.name}
                </Badge>
              </div>
              <div className="h-px bg-[#EDF1F7] my-2"></div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#8F9BB3]">Transfer Date:</span>
                <span className="font-medium text-[#222B45]">
                  {new Date(transferDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#8F9BB3]">Reason:</span>
                <span className="font-medium text-[#222B45]">{reason}</span>
              </div>
              {notes && (
                <div className="text-sm pt-2 border-t border-[#EDF1F7]">
                  <span className="text-[#8F9BB3] block mb-1">Notes:</span>
                  <span className="text-[#222B45]">{notes}</span>
                </div>
              )}
            </div>

            {/* Info Notice */}
            <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg mb-6">
              <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <div className="text-xs text-blue-900">
                <p className="font-medium mb-1">What happens next:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Member will be moved to {selectedBand?.name}</li>
                  <li>Current band membership will be marked as ended</li>
                  <li>
                    Band-specific roles and responsibilities will be updated
                  </li>
                  <li>Transfer record will be added to member's history</li>
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmation(false)}
                className="flex-1 border-[#EDF1F7] hover:border-[#009AF4] hover:text-[#009AF4]"
              >
                Go Back
              </Button>
              <Button
                onClick={handleConfirmTransfer}
                className="flex-1 bg-[#009AF4] hover:bg-[#0086D6] text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirm Transfer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-3xl border-[#EDF1F7] shadow-2xl my-8">
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#EDF1F7]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#009AF4]/10 flex items-center justify-center">
                <ArrowRightLeft className="w-5 h-5 text-[#009AF4]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#222B45]">
                  Transfer Member Between Bands
                </h2>
                <p className="text-sm text-[#8F9BB3]">
                  Move member from one band to another
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Member Info */}
            <div className="bg-[#F7F9FC] border border-[#EDF1F7] rounded-lg p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#009AF4] flex items-center justify-center shrink-0">
                  <span className="text-white font-semibold">
                    {memberData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#222B45]">
                    {memberData.name}
                  </h3>
                  <p className="text-sm text-[#8F9BB3]">ID: {memberData.id}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant="outline"
                      className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                    >
                      Current: {memberData.currentBand}
                    </Badge>
                    <span className="text-xs text-[#8F9BB3]">
                      {memberData.age} years old • {memberData.gender}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Select Band */}
            <div>
              <label className="block text-sm font-medium text-[#222B45] mb-2">
                Select Target Band <span className="text-red-500">*</span>
              </label>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8F9BB3]" />
                <input
                  type="text"
                  placeholder="Search bands by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm"
                />
              </div>

              <div className="border border-[#EDF1F7] rounded-lg max-h-80 overflow-y-auto">
                {filteredBands.length === 0 ? (
                  <div className="p-8 text-center text-[#8F9BB3]">
                    <Music className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No suitable bands found</p>
                    <p className="text-xs mt-1">
                      The current band and incompatible bands are hidden
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-0">
                    {filteredBands.map((band) => (
                      <button
                        key={band.id}
                        onClick={() => setSelectedBand(band)}
                        className={`w-full p-4 text-left border-b border-[#EDF1F7] last:border-0 transition-colors ${
                          selectedBand?.id === band.id
                            ? "bg-[#009AF4]/5 border-l-4 border-l-[#009AF4]"
                            : "hover:bg-[#F7F9FC]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            <div
                              className={`w-10 h-10 rounded-lg ${band.color} flex items-center justify-center shrink-0`}
                            >
                              <Music className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4
                                className={`font-medium ${
                                  selectedBand?.id === band.id
                                    ? "text-[#009AF4]"
                                    : "text-[#222B45]"
                                }`}
                              >
                                {band.name}
                              </h4>
                              <p className="text-sm text-[#8F9BB3] mt-1">
                                {band.description}
                              </p>
                              <div className="flex items-center gap-3 mt-2">
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-purple-50 text-purple-700 border-purple-200"
                                >
                                  {band.ageRange}
                                </Badge>
                                <span className="text-xs text-[#8F9BB3] flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {band.currentMembers} members
                                </span>
                              </div>
                            </div>
                          </div>
                          {selectedBand?.id === band.id && (
                            <CheckCircle className="w-5 h-5 text-[#009AF4] shrink-0" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Transfer Date */}
            <div>
              <label
                htmlFor="transferDate"
                className="block text-sm font-medium text-[#222B45] mb-2"
              >
                Transfer Effective Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8F9BB3]" />
                <input
                  type="date"
                  id="transferDate"
                  value={transferDate}
                  onChange={(e) => setTransferDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm"
                />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="effectiveImmediately"
                  checked={effectiveImmediately}
                  onChange={(e) => setEffectiveImmediately(e.target.checked)}
                  className="w-4 h-4 text-[#009AF4] border-[#EDF1F7] rounded focus:ring-[#009AF4]"
                />
                <label
                  htmlFor="effectiveImmediately"
                  className="text-sm text-[#222B45]"
                >
                  Make transfer effective immediately
                </label>
              </div>
            </div>

            {/* Reason */}
            <div>
              <label
                htmlFor="reason"
                className="block text-sm font-medium text-[#222B45] mb-2"
              >
                Reason for Transfer <span className="text-red-500">*</span>
              </label>
              <select
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm"
              >
                <option value="">Select a reason</option>
                <option value="Age Progression">Age Progression</option>
                <option value="Over-Age in Current Band">
                  Over-Age in Current Band
                </option>
                <option value="Personal Development">
                  Personal Development
                </option>
                <option value="Member Request">Member Request</option>
                <option value="Administrative Decision">
                  Administrative Decision
                </option>
                <option value="Leadership Recommendation">
                  Leadership Recommendation
                </option>
                <option value="Better Fit">
                  Better Fit for Member's Needs
                </option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Additional Notes */}
            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-[#222B45] mb-2"
              >
                Additional Notes (Optional)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Add any additional information about the band transfer..."
                className="w-full px-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm resize-none"
              />
            </div>

            {/* Info Notice */}
            <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <p className="text-xs text-blue-900">
                The member's band membership history will be updated. Their
                previous band record will be marked as ended on the transfer
                date, and a new active band membership will be created.
              </p>
            </div>

            {/* Age Warning if applicable */}
            {selectedBand && memberData.age && (
              <div>
                {(() => {
                  const ageRange = selectedBand.ageRange;
                  const match = ageRange.match(/(\d+)-?(\d+)?/);
                  if (match) {
                    const minAge = parseInt(match[1]);
                    const maxAge = match[2] ? parseInt(match[2]) : 999;

                    if (memberData.age < minAge || memberData.age > maxAge) {
                      return (
                        <div className="flex items-start gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                          <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" />
                          <div className="text-xs text-orange-900">
                            <p className="font-medium mb-1">Age Warning:</p>
                            <p>
                              The member's age ({memberData.age} years) is
                              outside the typical age range for{" "}
                              {selectedBand.name} ({ageRange}). Please confirm
                              this is the intended band for this transfer.
                            </p>
                          </div>
                        </div>
                      );
                    }
                  }
                  return null;
                })()}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-[#EDF1F7]">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-[#EDF1F7] hover:border-[#009AF4] hover:text-[#009AF4]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleTransferSubmit}
              disabled={!selectedBand || !transferDate || !reason}
              className="flex-1 bg-[#009AF4] hover:bg-[#0086D6] text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowRightLeft className="w-4 h-4 mr-2" />
              Proceed with Transfer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
