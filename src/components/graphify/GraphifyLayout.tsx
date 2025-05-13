
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { FunctionDefinition, PlotData, GraphViewSettings, GraphSet } from '@/types/graphify';
import FunctionList from './FunctionList';
import GraphDisplay from './GraphDisplay';
import StarterPanel from './StarterPanel';
import GraphControls from './GraphControls';
import { evaluate, compile, parse } from 'mathjs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription }
from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, FolderOpen, LogIn, LogOut, UserCircle, Loader2 } from 'lucide-react';
import { LineChart as LineChartIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { app } from '@/lib/firebase'; // Assuming firebase.ts initializes and exports 'app'

const INITIAL_X_MIN = -10;
const INITIAL_X_MAX = 10;
const INITIAL_Y_MIN = -10;
const INITIAL_Y_MAX = 10;

const PREDEFINED_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EC4899',
  '#8B5CF6', '#EF4444', '#6366F1', '#F97316',
  '#22D3EE', '#A3E635'
];

let colorIndex = 0;
const getNextColor = (): string => {
  const color = PREDEFINED_COLORS[colorIndex % PREDEFINED_COLORS.length];
  colorIndex = (colorIndex + 1); // Removed modulo here to cycle less predictably if many functions added/deleted
  if (colorIndex >= PREDEFINED_COLORS.length) colorIndex = 0;
  return color;
};

const initialViewSettings: GraphViewSettings = {
  xMin: INITIAL_X_MIN,
  xMax: INITIAL_X_MAX,
  yMin: INITIAL_Y_MIN,
  yMax: INITIAL_Y_MAX,
  grid: true,
  autoScaleY: true, // Start with autoScaleY true
};

export default function GraphifyLayout() {
  const [functions, setFunctions] = useState<FunctionDefinition[]>([
    { id: crypto.randomUUID(), expression: 'x^2', color: getNextColor(), isVisible: true, error: null },
  ]);
  const [viewSettings, setViewSettings] = useState<GraphViewSettings>(initialViewSettings);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userGraphSets, setUserGraphSets] = useState<GraphSet[]>([]);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingSets, setIsLoadingSets] = useState(false);

  const { toast } = useToast();
  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoadingAuth(false);
      if (user) {
        fetchUserGraphSets(user.uid);
      } else {
        setUserGraphSets([]);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const validateAndCompileExpression = (expression: string): { error: string | null } => {
    if (!expression.trim()) return { error: null };
    try {
      parse(expression);
      return { error: null };
    } catch (e) {
      const message = e instanceof Error ? e.message : "Invalid syntax";
      return { error: message.length > 50 ? message.substring(0, 50) + "..." : message };
    }
  };

  const handleAddFunction = (expression?: string) => {
    setFunctions(prev => {
      if (prev.length >= 10) { // Limit number of functions for performance
        toast({ title: "Function Limit Reached", description: "You can plot up to 10 functions.", variant: "destructive" });
        return prev;
      }
      const validation = validateAndCompileExpression(expression || '');
      return [
        ...prev,
        { id: crypto.randomUUID(), expression: expression || '', color: getNextColor(), isVisible: true, error: validation.error },
      ]
    });
  };

  const handleUpdateFunction = (id: string, updates: Partial<Omit<FunctionDefinition, 'id'>>) => {
    setFunctions(prev =>
      prev.map(f => {
        if (f.id === id) {
          const updatedFunc = { ...f, ...updates };
          if (updates.expression !== undefined) {
            const validation = validateAndCompileExpression(updates.expression);
            updatedFunc.error = validation.error;
          }
          return updatedFunc;
        }
        return f;
      })
    );
  };

  const handleDeleteFunction = (id: string) => {
    setFunctions(prev => {
      const newFunctions = prev.filter(f => f.id !== id);
      if (newFunctions.length === 0) {
        return [{ id: crypto.randomUUID(), expression: '', color: getNextColor(), isVisible: true, error: null }];
      }
      return newFunctions;
    });
  };
  
  const handleViewSettingsChange = (settingsUpdate: Partial<GraphViewSettings>) => {
    setViewSettings(prev => ({ ...prev, ...settingsUpdate }));
  };

  const handleResetView = () => setViewSettings(initialViewSettings);

  const handleZoom = (factor: number) => {
    setViewSettings(prev => {
      const xRange = prev.xMax - prev.xMin;
      const yRange = prev.yMax - prev.yMin;
      const xCenter = (prev.xMin + prev.xMax) / 2;
      const yCenter = (prev.yMin + prev.yMax) / 2;

      const newXMin = xCenter - (xRange / 2) * factor;
      const newXMax = xCenter + (xRange / 2) * factor;
      
      let newYMin = prev.yMin;
      let newYMax = prev.yMax;

      if(!prev.autoScaleY){
        newYMin = yCenter - (yRange / 2) * factor;
        newYMax = yCenter + (yRange / 2) * factor;
      }
      // Prevent extreme zoom-in
      if (Math.abs(newXMax - newXMin) < 0.01 || Math.abs(newYMax - newYMin) < 0.01 && !prev.autoScaleY) {
        return prev;
      }

      return { ...prev, xMin: newXMin, xMax: newXMax, yMin: newYMin, yMax: newYMax };
    });
  };
  
  const handlePan = (dxPercent: number, dyPercent: number) => {
    setViewSettings(prev => {
      const xRangeVal = prev.xMax - prev.xMin;
      const dx = xRangeVal * dxPercent;
      
      const newSettings = {
        ...prev,
        xMin: prev.xMin + dx,
        xMax: prev.xMax + dx,
      };

      if (!prev.autoScaleY) {
        const yRangeVal = prev.yMax - prev.yMin;
        const dy = yRangeVal * dyPercent;
        newSettings.yMin = prev.yMin + dy;
        newSettings.yMax = prev.yMax + dy;
      }
      return newSettings;
    });
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({ title: "Signed In", description: "You're now signed in with Google." });
    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast({ title: "Sign In Failed", description: (error as Error).message, variant: "destructive" });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({ title: "Signed Out", description: "You have been signed out." });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({ title: "Sign Out Failed", description: (error as Error).message, variant: "destructive" });
    }
  };

  const fetchUserGraphSets = async (uid: string) => {
    setIsLoadingSets(true);
    try {
      const q = query(collection(db, "users", uid, "graphSets"));
      const querySnapshot = await getDocs(q);
      const sets = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GraphSet));
      setUserGraphSets(sets);
    } catch (error) {
      console.error("Error fetching graph sets:", error);
      toast({ title: "Error Loading Sets", description: (error as Error).message, variant: "destructive" });
    } finally {
      setIsLoadingSets(false);
    }
  };

  const handleSaveGraphSet = async () => {
    if (!currentUser) {
      toast({ title: "Not Signed In", description: "Please sign in to save your graph set.", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    const setName = prompt("Enter a name for this graph set:", "My Graph");
    if (!setName) {
      setIsSaving(false);
      return;
    }

    const graphSetData: Omit<GraphSet, 'id'> = {
      name: setName,
      functions,
      viewSettings: { // Persist relevant parts of viewSettings
        xMin: viewSettings.xMin, xMax: viewSettings.xMax, 
        yMin: viewSettings.yMin, yMax: viewSettings.yMax, 
        grid: viewSettings.grid, autoScaleY: viewSettings.autoScaleY 
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "users", currentUser.uid, "graphSets"), graphSetData);
      toast({ title: "Graph Set Saved", description: `"${setName}" has been saved.` });
      fetchUserGraphSets(currentUser.uid); // Refresh list
    } catch (error) {
      console.error("Error saving graph set:", error);
      toast({ title: "Save Failed", description: (error as Error).message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadGraphSet = (set: GraphSet) => {
    setFunctions(set.functions.map(f => ({...f, id: crypto.randomUUID()}))); // Ensure new IDs for local state
    setViewSettings(prev => ({
        ...prev, // Keep some existing settings like target, width, height if needed by function-plot
        xMin: set.viewSettings.xMin,
        xMax: set.viewSettings.xMax,
        yMin: set.viewSettings.yMin,
        yMax: set.viewSettings.yMax,
        grid: set.viewSettings.grid,
        autoScaleY: set.viewSettings.autoScaleY ?? true,
    }));
    toast({ title: "Graph Set Loaded", description: `"${set.name}" is now active.` });
  };

  const handleDeleteGraphSet = async (setId: string) => {
     if (!currentUser || !setId) return;
     if (confirm("Are you sure you want to delete this graph set? This cannot be undone.")) {
        setIsSaving(true); // Use isSaving to indicate any backend operation
        try {
            await deleteDoc(doc(db, "users", currentUser.uid, "graphSets", setId));
            toast({title: "Graph Set Deleted", description: "The graph set has been removed."});
            fetchUserGraphSets(currentUser.uid);
        } catch (error) {
            console.error("Error deleting graph set:", error);
            toast({title: "Delete Failed", description: (error as Error).message, variant: "destructive"});
        } finally {
            setIsSaving(false);
        }
     }
  };


  return (
    <div className="p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6 min-h-screen flex flex-col">
      <Card className="shadow-xl flex-shrink-0">
        <CardHeader className="text-center pb-3 sm:pb-4">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-primary flex items-center justify-center gap-2">
            <LineChartIcon className="w-7 h-7 sm:w-8 sm:h-8" />
            Graphify Calculator
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-muted-foreground">
            Plot functions, explore graphs, and save your work.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-3 sm:pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
            <div className="flex gap-2">
            {currentUser && (
              <>
                <Button onClick={handleSaveGraphSet} variant="outline" size="sm" disabled={isSaving}>
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Save Set
                </Button>
                {/* Add a Popover or Dropdown for loading sets */}
              </>
            )}
            </div>
            {isLoadingAuth ? (
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            ) : currentUser ? (
              <div className="flex items-center gap-2">
                <UserCircle className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs sm:text-sm text-muted-foreground truncate max-w-[100px] sm:max-w-[150px]">{currentUser.displayName || currentUser.email}</span>
                <Button onClick={handleSignOut} variant="ghost" size="sm">
                  <LogOut className="mr-1 h-4 w-4" /> Sign Out
                </Button>
              </div>
            ) : (
              <Button onClick={handleGoogleSignIn} variant="outline" size="sm">
                <LogIn className="mr-2 h-4 w-4" /> Sign In with Google
              </Button>
            )}
          </div>
          {currentUser && userGraphSets.length > 0 && (
             <div className="mt-3 border-t pt-3">
                <h4 className="text-xs font-semibold text-muted-foreground mb-1">Your Saved Graph Sets:</h4>
                {isLoadingSets && <p className="text-xs text-muted-foreground">Loading sets...</p>}
                <div className="max-h-20 overflow-y-auto space-y-1 text-xs">
                    {userGraphSets.map(set => (
                        <div key={set.id} className="flex justify-between items-center p-1 hover:bg-muted/50 rounded">
                            <Button variant="link" size="sm" className="p-0 h-auto text-xs truncate" onClick={() => handleLoadGraphSet(set)}>
                                {set.name}
                            </Button>
                            <Button variant="ghost" size="icon" className="h-5 w-5 text-destructive" onClick={() => handleDeleteGraphSet(set.id!)} title="Delete set">
                                <FolderOpen className="h-3 w-3" /> {/* Using FolderOpen as placeholder, ideally Trash2 */}
                            </Button>
                        </div>
                    ))}
                </div>
             </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 flex-grow min-h-0">
        <div className="lg:col-span-1 space-y-4 flex flex-col min-h-0">
          <Card className="shadow-md flex-grow flex flex-col">
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-base sm:text-lg">Functions</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col p-2 sm:p-3">
              <FunctionList
                functions={functions}
                onUpdateFunction={handleUpdateFunction}
                onDeleteFunction={handleDeleteFunction}
                onAddFunction={() => handleAddFunction()}
              />
            </CardContent>
          </Card>
          <StarterPanel onAddSample={(expr) => handleAddFunction(expr)} />
        </div>

        <div className="lg:col-span-2 space-y-4 flex flex-col min-h-0">
           <GraphControls 
            viewSettings={viewSettings} 
            onViewSettingsChange={handleViewSettingsChange}
            onResetView={handleResetView}
            onZoom={handleZoom}
          />
          <div className="flex-grow min-h-[300px] sm:min-h-[400px] md:min-h-[500px]">
            <GraphDisplay 
                functions={functions.filter(f => f.isVisible && !f.error && f.expression.trim() !== '')} 
                viewSettings={viewSettings} 
                onPan={handlePan}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
