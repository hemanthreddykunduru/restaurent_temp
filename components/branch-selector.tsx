'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ChevronDown } from 'lucide-react';
import { branches } from '@/lib/data';
import { Branch } from '@/lib/types';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface BranchSelectorProps {
    selectedBranch: Branch | null;
    onBranchChange: (branch: Branch) => void;
}

export default function BranchSelector({ selectedBranch, onBranchChange }: BranchSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <div className="flex">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                            variant="outline"
                            className="flex items-center gap-2.5 bg-background hover:bg-muted border-border text-foreground rounded-2xl px-4 py-2.5 h-auto shadow-sm transition-all"
                        >
                            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                                <MapPin className="w-3.5 h-3.5 text-primary" />
                            </div>
                            <div className="flex flex-col items-start leading-none">
                                <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-[0.2em] mb-0.5">Location</span>
                                <span className="font-black text-xs">
                                    {selectedBranch ? selectedBranch.name.replace('Sangem Hotels - ', '') : 'Select Location'}
                                </span>
                            </div>
                            <motion.div
                                animate={{ rotate: isOpen ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                                className="ml-1"
                            >
                                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                            </motion.div>
                        </Button>
                    </motion.div>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[340px] bg-popover/95 backdrop-blur-xl border-border rounded-3xl p-3 shadow-2xl z-[150]">
                <div className="px-3 py-2 mb-2">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Our Hyderabad Outlets</h3>
                </div>
                <div className="space-y-1">
                    {branches.map((branch) => (
                        <DropdownMenuItem
                            key={branch.id}
                            onClick={() => onBranchChange(branch)}
                            className={`cursor-pointer p-4 rounded-2xl transition-all ${selectedBranch?.id === branch.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted font-medium'}`}
                        >
                            <div className="flex flex-col gap-1 w-full">
                                <div className="font-bold text-base flex justify-between items-center">
                                    {branch.name.replace('Sangem Hotels - ', '')}
                                    {selectedBranch?.id === branch.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                                </div>
                                <div className="text-xs text-muted-foreground line-clamp-1">{branch.address}</div>
                            </div>
                        </DropdownMenuItem>
                    ))}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
