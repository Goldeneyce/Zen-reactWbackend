"use client";

import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import { Switch } from "./ui/switch";
import { ProductFormSchema, CategoryType, ProductBadgeValues } from "../../../../packages/types/src/product";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { Plus, Trash2 } from "lucide-react";

// const categories = [
//   "all",
//   "power",
//   "appliances",
//   "entertainment",
//   "kitchen",
//   "security",
//   "cooling",
//   "solar",
//   "automation",
//   "lighting",

// ] as const;

const fetchCategories = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/categories`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch categories!");
  }

  return await res.json();
};

const AddProduct = () => {
  const form = useForm<z.infer<typeof ProductFormSchema>>({
    resolver: zodResolver(ProductFormSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      originalPrice: undefined,
      categorySlug: "",
      image: "",
      images: [],
      sizes: [],
      colors: [],
      features: [],
      specifications: [],
      inStock: true,
      payOnDelivery: false,
      badge: undefined,
      rating: 0,
      reviews: 0,
    },
  });

  const { isPending, error, data } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

    const getToken = async () => {
      const supabase = getSupabaseBrowserClient();
      const { data: { session } } = await supabase.auth.getSession();
      return session?.access_token;
    };

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof ProductFormSchema>) => {
      const token = await getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Failed to create product!");
      }
    },
    onSuccess: () => {
      toast.success("Product created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });


  return (
    <SheetContent>
      <ScrollArea className="h-screen">
        <SheetHeader>
          <SheetTitle className="mb-4">Add Product</SheetTitle>
          <SheetDescription asChild>
            <Form {...form}>
              <form className="space-y-8" onSubmit={form.handleSubmit((data) => mutation.mutate(data))}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the name of the product.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the description of the product.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          } />
                      </FormControl>
                      <FormDescription>
                        Enter the price of the product.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="originalPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Original Price (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Original price before discount"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(e.target.value ? Number(e.target.value) : undefined)
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Set to show a strikethrough price (e.g. for sales).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {data && (
                  <FormField
                    control={form.control}
                    name="categorySlug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              {data.map((cat: CategoryType) => (
                                <SelectItem key={cat.id} value={cat.slug}>
                                  {cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription>
                          Select the category of the product.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="badge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Badge (Optional)</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ?? ""}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a badge" />
                          </SelectTrigger>
                          <SelectContent>
                            {ProductBadgeValues.map((badge) => (
                              <SelectItem key={badge} value={badge}>
                                {badge}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        Optionally assign a badge like New, BestSeller, etc.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main Image</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  const formData = new FormData();
                                  formData.append("file", file);
                                  formData.append("upload_preset", "zentrics");
                                  const res = await fetch(
                                    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                                    { method: "POST", body: formData }
                                  );
                                  const data = await res.json();
                                  if (data.secure_url) {
                                    field.onChange(data.secure_url);
                                  }
                                } catch (error) {
                                  console.log(error);
                                  toast.error("Upload failed!");
                                }
                              }
                            }}
                          />
                          {field.value && (
                            <span className="text-green-600 text-sm">Image uploaded</span>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Upload the main product image.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Images (Optional)</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  const formData = new FormData();
                                  formData.append("file", file);
                                  formData.append("upload_preset", "zentrics");
                                  const res = await fetch(
                                    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                                    { method: "POST", body: formData }
                                  );
                                  const data = await res.json();
                                  if (data.secure_url) {
                                    const current = form.getValues("images") || [];
                                    form.setValue("images", [...current, data.secure_url]);
                                  }
                                } catch (error) {
                                  console.log(error);
                                  toast.error("Upload failed!");
                                }
                              }
                            }}
                          />
                          {field.value && field.value.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {field.value.map((url, idx) => (
                                <div key={idx} className="relative group">
                                  <img src={url} alt={`image-${idx}`} className="w-16 h-16 object-cover rounded" />
                                  <button
                                    type="button"
                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                                    onClick={() => {
                                      const current = form.getValues("images") || [];
                                      form.setValue("images", current.filter((_, i) => i !== idx));
                                    }}
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Upload additional product images.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sizes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sizes (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., S, M, L, XL or Mini, Standard, Pro" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Enter available sizes separated by commas. Leave empty if not applicable.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="colors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Colors (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Black, Silver, Carbon or Red, Blue, Green" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Enter available colors separated by commas. Leave empty if not applicable.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="features"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Features (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Waterproof, Wireless, Bluetooth"
                          value={field.value?.join(", ") ?? ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            field.onChange(
                              val ? val.split(",").map((s) => s.trim()).filter(Boolean) : []
                            );
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter product features separated by commas.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <FormLabel>Specifications (Optional)</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const current = form.getValues("specifications") || [];
                        form.setValue("specifications", [
                          ...current,
                          { key: "", name: "", value: "" },
                        ]);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add Spec
                    </Button>
                  </div>
                  {form.watch("specifications")?.map((_, index) => (
                    <div key={index} className="flex items-end gap-2">
                      <FormField
                        control={form.control}
                        name={`specifications.${index}.name`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel className="text-xs">Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Weight" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`specifications.${index}.key`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel className="text-xs">Key</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., weight" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`specifications.${index}.value`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel className="text-xs">Value</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 2.5 kg" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const current = form.getValues("specifications") || [];
                          form.setValue(
                            "specifications",
                            current.filter((_, i) => i !== index)
                          );
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
                <FormField
                  control={form.control}
                  name="inStock"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">In Stock</FormLabel>
                        <FormDescription>
                          Is this product currently in stock?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="payOnDelivery"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Pay on Delivery</FormLabel>
                        <FormDescription>
                          Allow customers to pay for this product on delivery.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {mutation.isPending ? "Submitting..." : "Submit"}
                </Button>
              </form>
            </Form>
          </SheetDescription>
        </SheetHeader>
      </ScrollArea>
    </SheetContent>
  );
};

export default AddProduct;
