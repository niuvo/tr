/*
function custom_variation_image_script() {
    if (is_product()) { // Ensure the script only loads on product pages
        ?>
        <script type="text/javascript">
*/
            jQuery(document).ready(function($) {
                // Define the attribute slugs for color and size
                var color_attr = 'attribute_pa_seleccione-color';  // Adjust based on your attribute slug for color
                var size_attr = 'attribute_pa_selecciona-tamano';  // Adjust based on your attribute slug for size

                // Function to update the product image based on the selected variation
                function updateProductImage(imageUrl) {
                    // Update the product image src attribute with the new image URL
                    $('.wvg-single-gallery-image-container img').attr('src', imageUrl);
                }

                // Function to find a variation by its attributes
                function findVariationByAttributes(attributes) {
                    // Retrieve the product variations data from the WooCommerce product form
                    var variations = JSON.parse($('.variations_form').attr('data-product_variations'));
                    for (var i = 0; i < variations.length; i++) {
                        var match = true;
                        // Loop through the attributes to find a matching variation
                        for (var key in attributes) {
                            if (variations[i].attributes[key] !== attributes[key]) {
                                match = false;
                                break;
                            }
                        }
                        // Return the matching variation if found
                        if (match) return variations[i];
                    }
                    return null;  // Return null if no matching variation is found
                }

                // Function to handle changes in the variation selectors
                function handleAttributeChange() {
                    // Get the selected color and size values from the dropdowns
                    var selectedColor = $('select[name="'+color_attr+'"]').val();
                    var selectedSize = $('select[name="'+size_attr+'"]').val();
                    var attributes = {};

                    // Add selected color and size to attributes object if they are selected
                    if (selectedColor) attributes[color_attr] = selectedColor;
                    if (selectedSize) attributes[size_attr] = selectedSize;

                    // Automatically select an available size if only color is selected
                    if (selectedColor && !selectedSize) {
                        var variations = JSON.parse($('.variations_form').attr('data-product_variations'));
                        for (var i = 0; i < variations.length; i++) {
                            if (variations[i].attributes[color_attr] === selectedColor) {
                                $('select[name="'+size_attr+'"]').val(variations[i].attributes[size_attr]).change();
                                return;
                            }
                        }
                    }

                    // Automatically select an available color if only size is selected
                    if (!selectedColor && selectedSize) {
                        var variations = JSON.parse($('.variations_form').attr('data-product_variations'));
                        for (var i = 0; i < variations.length; i++) {
                            if (variations[i].attributes[size_attr] === selectedSize) {
                                $('select[name="'+color_attr+'"]').val(variations[i].attributes[color_attr]).change();
                                return;
                            }
                        }
                    }

                    // Find the matching variation based on selected attributes
                    var variation = findVariationByAttributes(attributes);
                    if (variation && variation.image_src) {
                        // Update the product image if a matching variation is found
                        updateProductImage(variation.image_src);
                    }
                }

                // Set up event listeners for changes in the color and size dropdowns
                $('form.variations_form').on('change', 'select[name="'+color_attr+'"], select[name="'+size_attr+'"]', handleAttributeChange);

                // On page load, set the default image based on selected attributes
                handleAttributeChange();
            });
        </script>
        <?php
    }
}
add_action('wp_footer', 'custom_variation_image_script');
