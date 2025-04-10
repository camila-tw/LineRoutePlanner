import { useState, useCallback } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Home, Flag, Trash2, Plus, Route as RouteIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { addressInputSchema, type AddressInput } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface AddressFormProps {
  onSubmit: (data: AddressInput) => void;
  isLoading: boolean;
}

export function AddressForm({ onSubmit, isLoading }: AddressFormProps) {
  const { toast } = useToast();
  
  const form = useForm<AddressInput>({
    resolver: zodResolver(addressInputSchema),
    defaultValues: {
      startPoint: { address: "", note: "" },
      waypoints: [{ address: "", note: "" }],
      endPoint: { address: "", note: "" },
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "waypoints",
  });
  
  const handleSubmit = useCallback((data: AddressInput) => {
    onSubmit(data);
  }, [onSubmit]);
  
  const addWaypoint = () => {
    append({ address: "", note: "" });
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Starting Point */}
        <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
          <FormField
            control={form.control}
            name="startPoint.address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-700">起點地址</FormLabel>
                <div className="flex">
                  <FormControl>
                    <Input 
                      placeholder="輸入起點地址" 
                      {...field} 
                      className="flex-1"
                    />
                  </FormControl>
                  <Home className="text-blue-500 ml-2 self-center h-5 w-5" />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Waypoints */}
        {fields.map((field, index) => (
          <div 
            key={field.id} 
            className="address-item p-4 rounded-md border border-gray-300 bg-white"
          >
            <div className="flex justify-between mb-2">
              <FormLabel className="text-gray-700">地址 {index + 1}</FormLabel>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700 p-0 h-8 w-8"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
            
            <FormField
              control={form.control}
              name={`waypoints.${index}.address`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      placeholder="輸入中途地址" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}
        
        {/* End Point */}
        <div className="bg-green-50 p-4 rounded-md border border-green-100">
          <FormField
            control={form.control}
            name="endPoint.address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-green-700">終點地址</FormLabel>
                <div className="flex">
                  <FormControl>
                    <Input 
                      placeholder="輸入終點地址" 
                      {...field} 
                      className="flex-1"
                    />
                  </FormControl>
                  <Flag className="text-green-500 ml-2 self-center h-5 w-5" />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Add Address Button */}
        <div className="mt-4">
          <Button
            type="button"
            variant="outline"
            className="flex items-center"
            onClick={addWaypoint}
          >
            <Plus className="mr-1 h-4 w-4" />
            新增地址
          </Button>
        </div>
        
        {/* Submit Button */}
        <div className="mt-6">
          <Button
            type="submit"
            className="w-full flex justify-center items-center"
            disabled={isLoading}
          >
            <RouteIcon className="mr-1 h-5 w-5" />
            {isLoading ? "處理中..." : "產生路徑規劃"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
